import { RmixDefinition, RmixNode } from "../types";
import { createNode } from "../api/rmixNode";

enum STATUS {
  SETUP = "SETUP",
  PRE_MAP_CHECK = "PRE_CHECK",
  VISIT_NODE_CHILDREN = "VISIT_NODE_CHILDREN",
  COMBINE_PROCESSED_CHILDREN = "COMBINE_PROCESSED_CHILDREN",
  POST_MAP_CHECK = "POST_CHECK",
  REPORT_TO_PARENT = "REPORT_TO_PARENT",
}

interface Frame {
  status: STATUS;
  parent: Frame;
  node: RmixNode;
  currentChild?: RmixNode;
  scope?: Record<string, RmixDefinition>;
  currentProcessedChild: RmixNode;
  processedChildren: RmixNode;
}

const head = (node: RmixNode) => node.value;
const tail = (node: RmixNode) => node.next;
const isNode = (node: RmixNode | string | number): node is RmixNode =>
  typeof node === "object";

const getTag = (tag: string, frame: Frame) => {
  let currentFrame = frame;

  while (currentFrame) {
    if (currentFrame.scope && currentFrame.scope[tag]) {
      return currentFrame.scope[tag];
    } else {
      currentFrame = currentFrame.parent;
    }
  }
};

const createFrame = (
  frame: Omit<
    Frame,
    "processedChildren" | "currentProcessedChild" | "currentChild"
  >
): Frame => {
  const processChildren = createNode("_");
  (frame as Frame).currentChild = frame.node;
  (frame as Frame).processedChildren = processChildren;
  (frame as Frame).currentProcessedChild = processChildren;

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
    currentProcessedChild: createNode("_"),
  };

  const root = createFrame({
    status: STATUS.SETUP,
    node: input,
    scope: {},
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

        stack.push(frame);
        break;
      }
      case STATUS.PRE_MAP_CHECK: {
        const tag = head(frame.node);

        if (typeof tag !== "string") {
          throw new Error(
            `Invariant violation: tag is not a string. Received ${tag}.

Stacktrace:
${generateStack(frame)}`
          );
        }

        const preFunction = getTag(tag, frame)?.pre;

        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = createNode("_", tail(frame.node));
          stack.push(frame);
        } else if (preFunction) {
          try {
            const result = preFunction(tail(frame.node));

            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

            stack.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame.parent,
                node: result.node,
                scope: result.innerScope,
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
        let currentChild = frame.currentChild?.next;
        frame.currentChild = currentChild;

        // Push children to stack for processing
        if (currentChild) {
          // Prepare parent frame and add to stack
          frame.status = STATUS.VISIT_NODE_CHILDREN;
          stack.push(frame);

          const value = head(currentChild);
          if (isNode(value)) {
            stack.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame,
                node: value,
              })
            );
          } else if (value !== null && value !== undefined) {
            stack.push(
              createFrame({
                status: STATUS.REPORT_TO_PARENT,
                parent: frame,
                node: createNode("_", createNode(value)),
              })
            );
          }
        } else {
          // Prepare parent frame and add to stack
          frame.status = STATUS.COMBINE_PROCESSED_CHILDREN;
          stack.push(frame);
        }

        break;
      }
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node.next = frame.processedChildren.next;
        frame.status = STATUS.POST_MAP_CHECK;

        if (head(frame.node) === "~") {
          frame.parent.scope =
            frame.parent.scope &&
            frame.scope &&
            Object.assign(frame.parent.scope || {}, frame.scope || {});
        }

        stack.push(frame);
        break;
      }
      case STATUS.POST_MAP_CHECK: {
        const tag = head(frame.node);

        if (typeof tag !== "string") {
          throw new Error(
            `Invariant violation: tag is not a string. Received ${tag}.

Stacktrace:
${generateStack(frame)}`
          );
        }

        const postFunction = getTag(tag, frame)?.post;

        if (postFunction) {
          try {
            const result = postFunction(tail(frame.node));

            if (result.siblingScope) {
              frame.parent.scope = Object.assign(
                frame.parent.scope || {},
                result.siblingScope
              );
            }

            stack.push(
              createFrame({
                status: STATUS.SETUP,
                parent: frame.parent,
                node: result.node,
                scope: result.innerScope,
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
          frame.parent.currentProcessedChild.next = tail(frame.node);

          while (frame.parent.currentProcessedChild.next !== undefined) {
            frame.parent.currentProcessedChild =
              frame.parent.currentProcessedChild.next;
          }
        } else {
          frame.parent.currentProcessedChild.next = createNode(frame.node);
          frame.parent.currentProcessedChild =
            frame.parent.currentProcessedChild.next;
        }
        break;
      }
    }
  }

  return root.node;
};

export default process;
