const head = (node) => node[0];
const tail = (node) => [...node.slice(1)];

const process = (input, scope = {}) => {
  const tag = head(input);

  if (Array.isArray(tag)) {
    new Error("Invariant violation: tag must be a symbol");
  }

  if (tag === "'") {
    return { node: ["_", ...tail(input)] };
  } else if (scope[tag] && scope[tag].pre) {
    const { node, siblingScope, innerScope } = scope[tag].pre(
      tail(input),
      scope
    );

    const output = process(node, {
      ...scope,
      ...siblingScope,
      ...innerScope,
    });

    return {
      node: output.node,
      siblingScope: { ...siblingScope, ...output.siblingScope },
    };
  } else {
    let siblingScope = {};

    const visited = [];
    const children = tail(input);
    while (children.length > 0) {
      const child = children.shift();

      if (Array.isArray(child)) {
        const { node, siblingScope: newSiblingScope } = process(child, {
          ...scope,
          ...siblingScope,
        });

        siblingScope = { ...siblingScope, ...newSiblingScope };

        let processedChildren = [node];
        if (node[0] === "_") {
          processedChildren = tail(node);
        }

        visited.push(...processedChildren);
      } else if (child !== undefined && child !== null) {
        visited.push(child);
      }
    }

    if (tag === "~") {
      return process(["_", ...visited], scope);
    } else if (scope[tag] && scope[tag].post) {
      const { post } = scope[tag];

      const { node, siblingScope, innerScope } = post(visited, scope);

      const output = process(node, {
        ...scope,
        ...siblingScope,
        ...innerScope,
      });

      return {
        node: output.node,
        siblingScope: { ...siblingScope, ...output.siblingScope },
      };
    } else {
      return { node: [tag, ...visited], siblingScope };
    }
  }
};

export default process;
