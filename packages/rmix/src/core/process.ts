import { RmixDefinition, RmixNode } from "../types";
import { createNode, isNode } from "../api/rmixNode";
import { STATUS } from "./types";
import { createFrame, getTagFromFrame } from "./frame";
import { createErrorMessage, ERROR_TYPES } from "./error";

/**
 * Processes a node and its children according to a set of rules. Forms the core
 * of rmix.
 */
const process = (
  input: RmixNode,
  initialScope: Record<string, RmixDefinition> = {}
) => {
  const base = {
    node: createNode("_", input),
    currentProcessedChild: createNode("_"),
  };

  const root = createFrame({
    status: STATUS.PRE_MAP_CHECK,
    node: input,
    scope: initialScope,
    // The base node has a different schema, but we do not need to worry about it
    parent: base as any,
  });

  // We start processing at the node root and visit all of its children and so on
  let frame = root;

  // We keep going until the frame is undefined. This means we have successfully traversed
  // the complete rmix tree.
  while (frame) {
    switch (frame.status) {
      // Check if a tag matches a pre-map function in scope
      case STATUS.PRE_MAP_CHECK: {
        const tag = frame.node.value;

        if (typeof tag !== "string") {
          throw new Error(
            createErrorMessage(
              ERROR_TYPES.INVARIANT,
              `tag is not a string. Received ${tag}.`,
              frame
            )
          );
        }

        const preFunction = getTagFromFrame(tag, frame)?.pre;

        // SPECIAL FORM. Encountering a quote ' means we should stop processing the node's children
        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = createNode("_", frame.node.next);
        }
        // If there is a pre-map function match, we run the function and replace the current
        // node with its result, thereby mapping it.
        else if (preFunction) {
          try {
            const result = preFunction(frame.node.next);

            // A mapping may request to modify the parent's scope
            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

            // Replace the current node with the pre function result
            frame = createFrame({
              status: STATUS.PRE_MAP_CHECK,
              // Note that we are passing the parent of the current node
              // The current node is therefore replaced
              parent: frame.parent,
              node: result.node,
              scope: result.innerScope,
            });
          } catch (e) {
            console.error(
              createErrorMessage(ERROR_TYPES.USER, e.message, frame)
            );

            frame.status = STATUS.VISIT_NODE_CHILDREN;
          }
        } else {
          frame.status = STATUS.VISIT_NODE_CHILDREN;
        }
        break;
      }
      // Visit the node's children one by one
      case STATUS.VISIT_NODE_CHILDREN: {
        let currentChild = frame.currentChild?.next;
        frame.currentChild = currentChild;

        if (currentChild) {
          frame.status = STATUS.VISIT_NODE_CHILDREN;

          const { value } = currentChild;
          // If the current child is a node, we process it
          if (isNode(value)) {
            frame = createFrame({
              status: STATUS.PRE_MAP_CHECK,
              parent: frame,
              node: value,
            });
          }
          // If the current child is a value, no need to process it
          else if (value !== null && value !== undefined) {
            frame.currentProcessedChild.next = createNode(value);
            frame.currentProcessedChild = frame.currentProcessedChild.next;
          }
        } else {
          frame.status = STATUS.COMBINE_PROCESSED_CHILDREN;
        }

        break;
      }
      // Replace the node's children with the processed children
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node.next = frame.processedChildren.next;
        frame.status = STATUS.POST_MAP_CHECK;
        break;
      }
      // Check if a tag matches a post-map function in scope
      case STATUS.POST_MAP_CHECK: {
        const tag = frame.node.value;

        if (typeof tag !== "string") {
          throw new Error(
            createErrorMessage(
              ERROR_TYPES.INVARIANT,
              `tag is not a string. Received ${tag}.`,
              frame
            )
          );
        }

        const postFunction = getTagFromFrame(tag, frame)?.post;

        // If there is a post-map function match, we run the function and replace the current
        // node with its result, thereby mapping it
        if (postFunction) {
          try {
            const result = postFunction(frame.node.next);

            // A mapping may request to modify the parent's scope
            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

            // Note that we are passing the parent of the current node
            // The current node is therefore replaced
            frame = createFrame({
              status: STATUS.PRE_MAP_CHECK,
              parent: frame.parent,
              node: result.node,
              scope: result.innerScope,
            });
          } catch (e) {
            console.error(
              createErrorMessage(ERROR_TYPES.USER, e.message, frame)
            );

            frame.status = STATUS.REPORT_TO_PARENT;
          }
        } else {
          frame.status = STATUS.REPORT_TO_PARENT;
        }

        break;
      }
      // Put the result of this iteration in the parent's processed children list
      case STATUS.REPORT_TO_PARENT: {
        if (frame.node.value === "_") {
          frame.parent.currentProcessedChild.next = frame.node.next;

          while (frame.parent.currentProcessedChild.next !== undefined) {
            frame.parent.currentProcessedChild =
              frame.parent.currentProcessedChild.next;
          }
        } else {
          frame.parent.currentProcessedChild.next = createNode(frame.node);
          frame.parent.currentProcessedChild =
            frame.parent.currentProcessedChild.next;
        }

        frame = frame.parent;
        break;
      }
      default: {
        frame = frame.parent;
      }
    }
  }

  return root.node;
};

export default process;
