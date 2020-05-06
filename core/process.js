const head = (node) => node[0];
const tail = (node) => node.slice(1);

export const process = (node, scope = {}) => {
  if (head(node)[0] === "#" && scope[head(node)]) {
    const newNode = scope[head(node)](node, scope);
    node = newNode !== undefined ? newNode : node;
  }

  const children = [];
  for (let child of tail(node)) {
    if (Array.isArray(child)) {
      child = process(child, scope);

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
