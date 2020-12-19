const STATUS = {
  SETUP: "SETUP",
  PRE_MAP_CHECK: "PRE_CHECK",
  VISIT_NODE_CHILDREN: "VISIT_NODE_CHILDREN",
  COMBINE_PROCESSED_CHILDREN: "COMBINE_PROCESSED_CHILDREN",
  POST_MAP_CHECK: "POST_CHECK",
  REPORT_TO_PARENT: "REPORT_TO_PARENT",
};

const head = (node) => node[0];
const tail = (node) => node.slice(1);

const process = (input, initialScope = {}) => {
  const base = {
    node: ["_", input],
    scope: initialScope,
    processedChildren: [],
  };

  const root = {
    status: STATUS.SETUP,
    parent: base,
    node: input,
    innerScope: {},
  };

  const stack = [root];

  while (stack.length > 0) {
    const frame = stack.pop();

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
        const scope = frame.scope;

        if (tag === "'") {
          frame.status = STATUS.REPORT_TO_PARENT;
          frame.node = ["_", ...tail(frame.node)];
          stack.push(frame);
        } else if (tag in scope && "pre" in scope[tag]) {
          const result = scope[tag].pre(tail(frame.node), scope);

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
            innerScope: { ...frame.innerScope, ...result.innerScope },
          });
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
              innerScope: {},
            });
          } else if (child !== null && child !== undefined) {
            stack.push({
              status: STATUS.REPORT_TO_PARENT,
              parent: frame,
              node: ["_", child],
              innerScope: {},
            });
          }
        }
        break;
      }
      case STATUS.COMBINE_PROCESSED_CHILDREN: {
        frame.node = [head(frame.node), ...frame.processedChildren];
        frame.status = STATUS.POST_MAP_CHECK;
        frame.parent.siblingScope = {
          ...frame.parent.siblingScope,
          ...frame.siblingScope,
        };
        stack.push(frame);
        break;
      }
      case STATUS.POST_MAP_CHECK: {
        const tag = head(frame.node);
        const scope = frame.scope;

        if (tag === "~") {
          frame.status = STATUS.PRE_MAP_CHECK;
          frame.node(["_", ...tail(frame.node)]);
          stack.push(frame);
        } else if (tag in scope && "post" in scope[tag]) {
          const result = scope[tag].post(tail(frame.node), scope);

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
            innerScope: { ...frame.innerScope, ...result.innerScope },
          });
        } else {
          frame.status = STATUS.REPORT_TO_PARENT;
          stack.push(frame);
        }

        break;
      }
      case STATUS.REPORT_TO_PARENT: {
        if (head(frame.node) === "_") {
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
