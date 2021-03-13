import { RmixDefinition, RmixNode } from "./types";

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
  processedChildren: RmixNode;
}

const head = (node: RmixNode) => node[0];
const tail = (node: RmixNode) => node.slice(1);

const locateTagInScope = (
  tag: string,
  scope: Record<string, RmixDefinition>
) => {
  const tagLevels = tag.split(".");

  let activeScope = scope;
  for (let i = 0; i < tagLevels.length - 1; i++) {
    const currentTag = tagLevels[i];

    if (activeScope[currentTag] && activeScope[currentTag].namespace) {
      activeScope = activeScope[currentTag].namespace!;
    } else {
      return undefined;
    }
  }

  return activeScope[tagLevels[tagLevels.length - 1]];
};

const process = (
  input: RmixNode,
  initialScope: Record<string, RmixDefinition> = {}
) => {
  const base = {
    node: ["_", input],
    scope: initialScope,
    processedChildren: [],
  };

  const root = {
    status: STATUS.SETUP,
    node: input,
    scope: {},
    innerScope: {},
    siblingScope: {},
    // The base node has a different schema, but we do not need to worry about it
    parent: base as any,
    processedChildren: [],
  };

  const stack: Frame[] = [root];

  while (stack.length > 0) {
    const frame = stack.pop();

    if (frame === undefined) {
      throw new Error("Process error: saw an undefined frame");
    }

    switch (frame.status) {
      case STATUS.SETUP: {
        frame.status = STATUS.PRE_MAP_CHECK;
        frame.scope = {
          ...frame.parent.scope,
          ...frame.parent.siblingScope,
          ...frame.innerScope,
        };

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

        const preFunction = locateTagInScope(tag, scope)?.pre;

        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = ["_", ...tail(frame.node)];
          stack.push(frame);
        } else if (preFunction) {
          try {
            const result = preFunction(tail(frame.node), scope);

            if (result.siblingScope) {
              frame.parent.siblingScope = {
                ...frame.parent.siblingScope,
                ...result.siblingScope,
              };
            }

            stack.push({
              status: STATUS.SETUP,
              parent: frame.parent,
              node: result.node,
              scope: {},
              innerScope: { ...frame.innerScope, ...result.innerScope },
              siblingScope: {},
              processedChildren: [],
            });
          } catch (e) {
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
        frame.processedChildren = [];
        stack.push(frame);

        const children = tail(frame.node);

        // Push children to stack for processing
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (Array.isArray(child)) {
            stack.push({
              status: STATUS.SETUP,
              parent: frame,
              node: child,
              scope: {},
              siblingScope: {},
              innerScope: {},
              processedChildren: [],
            });
          } else if (child !== null && child !== undefined) {
            stack.push({
              status: STATUS.REPORT_TO_PARENT,
              parent: frame,
              node: ["_", child],
              scope: {},
              siblingScope: {},
              innerScope: {},
              processedChildren: [],
            });
          }
        }
        break;
      }
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node = [head(frame.node), ...frame.processedChildren];
        frame.status = STATUS.POST_MAP_CHECK;

        if (head(frame.node) === "~") {
          frame.parent.siblingScope = {
            ...frame.parent.siblingScope,
            ...frame.siblingScope,
          };
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

        const postFunction = locateTagInScope(tag, scope)?.post;

        if (postFunction) {
          try {
            const result = postFunction(tail(frame.node), scope);

            if (result.siblingScope) {
              frame.parent.siblingScope = {
                ...frame.parent.siblingScope,
                ...result.siblingScope,
              };
            }

            stack.push({
              status: STATUS.SETUP,
              parent: frame.parent,
              node: result.node,
              scope: {},
              innerScope: { ...frame.innerScope, ...result.innerScope },
              siblingScope: {},
              processedChildren: [],
            });
          } catch (e) {
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
          frame.parent.processedChildren.push(...tail(frame.node));
        } else {
          frame.parent.processedChildren.push(frame.node);
        }
        break;
      }
    }
  }

  return root.node;
};

export default process;
