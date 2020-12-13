export default {
  head: {
    map: (node) => ({ node: ["_", node[0]] }),
  },
  tail: {
    map: (node) => ({ node: ["_", ...node.slice(1)] }),
  },
  len: {
    map: (node) => ({ node: ["_", node.length] }),
  },
};
