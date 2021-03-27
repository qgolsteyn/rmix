import { RmixDefinition, RmixNode } from "../types";
import { createNode, isNode } from "../api/rmixNode";
import { Frame, STATUS } from "./types";
import { createFrame, getTagFromFrame } from "./frame";
import { createErrorMessage, ERROR_TYPES } from "./error";

const process = (
  input: RmixNode,
  initialScope: Record<string, RmixDefinition> = {}
) => {
  const base = {
    node: createNode("_", input),
    scope: initialScope,
    currentProcessedChild: createNode("_"),
  };

  const root = createFrame({
    status: STATUS.PRE_MAP_CHECK,
    node: input,
    // The base node has a different schema, but we do not need to worry about it
    parent: base as any,
  });

  let frame = root;

  while (frame) {
    switch (frame.status) {
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

        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = createNode("_", frame.node.next);
        } else if (preFunction) {
          try {
            const result = preFunction(frame.node.next);

            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

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

            frame.status = STATUS.VISIT_NODE_CHILDREN;
          }
        } else {
          frame.status = STATUS.VISIT_NODE_CHILDREN;
        }
        break;
      }
      case STATUS.VISIT_NODE_CHILDREN: {
        let currentChild = frame.currentChild?.next;
        frame.currentChild = currentChild;

        // Push children to stack for processing
        if (currentChild) {
          // Prepare parent frame
          frame.status = STATUS.VISIT_NODE_CHILDREN;

          const { value } = currentChild;
          if (isNode(value)) {
            frame = createFrame({
              status: STATUS.PRE_MAP_CHECK,
              parent: frame,
              node: value,
            });
          } else if (value !== null && value !== undefined) {
            frame = createFrame({
              status: STATUS.REPORT_TO_PARENT,
              parent: frame,
              node: createNode("_", createNode(value)),
            });
          }
        } else {
          // Prepare parent frame
          frame.status = STATUS.COMBINE_PROCESSED_CHILDREN;
        }

        break;
      }
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node.next = frame.processedChildren.next;
        frame.status = STATUS.POST_MAP_CHECK;
        break;
      }
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

        if (postFunction) {
          try {
            const result = postFunction(frame.node.next);

            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

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
