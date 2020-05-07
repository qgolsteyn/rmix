const head = (node) => node[0];
const tail = (node) => node.slice(1);

export const process = (node, scope = {}) => {
  const children = [];
  const childrenScope = head(node) !== "_" ? { ...scope } : scope;
  for (let child of tail(node)) {
    if (Array.isArray(child)) {
      if (child[0][0] === "#" && childrenScope[head(child)]) {
        const newChild = childrenScope[head(child)](child, childrenScope);
        child = newChild !== undefined ? newChild : child;
      } else {
        child = process(child, childrenScope);
      }

      if (child[0] === "_") {
        children.push(...tail(child));
      } else {
        children.push(child);
      }
    } else if (child !== null && child !== undefined) {
      children.push(child);
    }
  }

  node = [head(node), ...children];

  if (scope[head(node)]) {
    const newNode = scope[head(node)](node, scope);
    node = newNode !== undefined ? newNode : node;
  }

  return node;
};
