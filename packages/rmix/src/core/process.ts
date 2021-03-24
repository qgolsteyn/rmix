import _ from "lodash";
import { RmixDefinition, RmixNode } from "../types";
import { createNode } from "./node";

const VISITED_SYMBOL = Symbol("visited");

const merge = (...rest: Array<Record<string, unknown> | undefined>) =>
  _.merge({}, ...rest);

enum STATUS {
  SETUP = "SETUP",
  PRE_MAP_CHECK = "PRE_CHECK",
  VISIT_NODE_CHILDREN = "VISIT_NODE_CHILDREN",
  COMBINE_PROCESSED_CHILDREN = "COMBINE_PROCESSED_CHILDREN",
  POST_MAP_CHECK = "POST_CHECK",
  REPORT_TO_PARENT = "REPORT_TO_PARENT",
}

interface Frame {
  node: RmixNode;
  parent: Frame;
  status: STATUS;
  scope: Record<string, RmixDefinition>;
  innerScope: Record<string, RmixDefinition>;
  siblingScope: Record<string, RmixDefinition>;
  processedChildrenHead: RmixNode;
  processedChildrenTail: RmixNode;
}

const head = (node: RmixNode) => node.value;
const tail = (node: RmixNode) => node.next;
const isNode = (node: RmixNode | string | number): node is RmixNode =>
  typeof node === "object";

const createFrame = (
  frame: Omit<Frame, "processedChildrenHead" | "processedChildrenTail">
): Frame => {
  const processChildren = createNode("_");
  (frame as Frame).processedChildrenHead = processChildren;
  (frame as Frame).processedChildrenTail = processChildren;

  return frame as Frame;
};

const generateStack = (frame: Frame) => {
  const tags = [];
  let currentFrame = frame;

  while (currentFrame) {
    tags.push(currentFrame.node.value);
    currentFrame = currentFrame.parent;
  }

  return '"' + tags.join('"\nin "');
};

const process = (
  input: RmixNode,
  initialScope: Record<string, RmixDefinition> = {}
) => {
  const base = {
    node: createNode("_", input),
    scope: initialScope,
    processedChildrenTail: createNode("_"),
  };

  const root = createFrame({
    status: STATUS.SETUP,
    node: input,
    scope: {},
    innerScope: {},
    siblingScope: {},
    // The base node has a different schema, but we do not need to worry about it
    parent: base as any,
  });

  const stack: Frame[] = [root];

  while (stack.length > 0) {
    const frame = stack.pop();

    if (frame === undefined) {
      throw new Error("Process error: saw an undefined frame");
    }

    switch (frame.status) {
      case STATUS.SETUP: {
        frame.status = STATUS.PRE_MAP_CHECK;
        frame.scope = merge(
          frame.parent.scope,
          frame.parent.siblingScope,
          frame.innerScope
        );

        if ((frame.node as any)[VISITED_SYMBOL]) {
          throw new Error(`Invariant violation: node was seen twice.

Stacktrace:
${generateStack(frame)}`);
        } else {
          (frame.node as any)[VISITED_SYMBOL] = true;
        }

        stack.push(frame);
        break;
      }
      case STATUS.PRE_MAP_CHECK: {
        const tag = head(frame.node);

        if (typeof tag !== "string") {
          throw new Error(
            `Invariant violation: tag is not a string. Received ${tag}`
          );
        }

        const scope = frame.scope;

        const preFunction = scope[tag]?.pre;

        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = createNode("_", tail(frame.node));
          stack.push(frame);
        } else if (preFunction) {
          try {
            const result = preFunction(tail(frame.node), scope);

            if (result.siblingScope) {
              frame.parent.siblingScope = merge(
                frame.parent.siblingScope,
                result.siblingScope
              );
            }

            stack.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame.parent,
                node: result.node,
                scope: {},
                innerScope: merge(frame.innerScope, result.innerScope),
                siblingScope: {},
              })
            );
          } catch (e) {
            console.error(e);
            frame.status = STATUS.VISIT_NODE_CHILDREN;
            stack.push(frame);
          }
        } else {
          frame.status = STATUS.VISIT_NODE_CHILDREN;
          stack.push(frame);
        }
        break;
      }
      case STATUS.VISIT_NODE_CHILDREN: {
        // Prepare parent frame and add to stack
        frame.status = STATUS.COMBINE_PROCESSED_CHILDREN;
        frame.siblingScope = {};
        stack.push(frame);

        const childrenFrames: Frame[] = [];
        let currentChildren = tail(frame.node);

        // Push children to stack for processing
        while (currentChildren) {
          const value = head(currentChildren);
          if (isNode(value)) {
            childrenFrames.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame,
                node: value,
                scope: {},
                siblingScope: {},
                innerScope: {},
              })
            );
          } else if (value !== null && value !== undefined) {
            childrenFrames.push(
              createFrame({
                status: STATUS.REPORT_TO_PARENT,
                parent: frame,
                node: createNode("_", createNode(value)),
                scope: {},
                siblingScope: {},
                innerScope: {},
              })
            );
          }

          currentChildren = currentChildren.next;
        }

        for (let i = childrenFrames.length - 1; i >= 0; i--) {
          stack.push(childrenFrames[i]);
        }

        break;
      }
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node.next = frame.processedChildrenHead.next;
        frame.status = STATUS.POST_MAP_CHECK;

        if (head(frame.node) === "~") {
          frame.parent.siblingScope = merge(
            frame.parent.siblingScope,
            frame.siblingScope
          );
        }

        stack.push(frame);
        break;
      }
      case STATUS.POST_MAP_CHECK: {
        const tag = head(frame.node);
        const scope = frame.scope;

        if (typeof tag !== "string") {
          throw new Error("Invariant violation: tag is not a string");
        }

        const postFunction = scope[tag]?.post;

        if (postFunction) {
          try {
            const result = postFunction(tail(frame.node), scope);

            if (result.siblingScope) {
              frame.parent.siblingScope = merge(
                frame.parent.siblingScope,
                result.siblingScope
              );
            }

            stack.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame.parent,
                node: result.node,
                scope: {},
                innerScope: merge(frame.innerScope, result.innerScope),
                siblingScope: {},
              })
            );
          } catch (e) {
            console.error(e);
            frame.status = STATUS.REPORT_TO_PARENT;
            stack.push(frame);
          }
        } else {
          frame.status = STATUS.REPORT_TO_PARENT;
          stack.push(frame);
        }

        break;
      }
      case STATUS.REPORT_TO_PARENT: {
        if (head(frame.node) === "_" || head(frame.node) === "~") {
          frame.parent.processedChildrenTail.next = tail(frame.node);

          while (frame.parent.processedChildrenTail.next !== undefined) {
            frame.parent.processedChildrenTail =
              frame.parent.processedChildrenTail.next;
          }
        } else {
          frame.parent.processedChildrenTail.next = createNode(frame.node);
          frame.parent.processedChildrenTail =
            frame.parent.processedChildrenTail.next;
        }
        break;
      }
    }
  }

  return root.node;
};

export default process;
