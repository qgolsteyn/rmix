const head = (node) => node[0];
const tail = (node) => [...node.slice(1)];

export const process = (input, scope = {}) => {
  const tag = head(input);

  if (Array.isArray(tag)) {
    new Error("Invariant violation: tag must be a symbol");
  }

  if (scope[tag] && scope[tag].preMap) {
    const { node, siblingScope, innerScope } = scope[tag].preMap(
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
    let siblingScope = { ...scope };

    const visited = [];
    const children = tail(input);
    while (children.length > 0) {
      const child = children.shift();

      if (Array.isArray(child)) {
        const { node, siblingScope: newSiblingScope } = process(
          child,
          siblingScope
        );

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

    if (scope[tag] && scope[tag].map) {
      const { map } = scope[tag];

      const { node, siblingScope, innerScope } = map(visited, scope);

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
      return { node: [tag, ...visited] };
    }
  }
};
