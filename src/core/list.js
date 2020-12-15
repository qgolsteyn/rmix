export default {
  head: {
    post: (node) => ({ node: ["_", node[0]] }),
  },
  tail: {
    post: (node) => ({ node: ["_", ...node.slice(1)] }),
  },
  len: {
    post: (node) => ({ node: ["_", node.length] }),
  },
  get: {
    post: (node) => ({ node: ["_", node.slice(1)[node[0]]] }),
  },
};
