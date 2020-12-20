import { mapTailAsObject } from "../utils/mapTailAsObject";

export default {
  ".head": {
    post: (node) => ({ node: ["_", node[0]] }),
  },
  ".tail": {
    post: (node) => ({ node: ["_", ...node.slice(1)] }),
  },
  ".len": {
    post: (node) => ({ node: ["_", node.length] }),
  },
  ".get": {
    post: (node) => ({ node: ["_", node.slice(1)[node[0]]] }),
  },
  ".map": {
    post: ([tag, ...list]) => ({
      node: ["_", ...list.map((item) => [tag, item])],
    }),
  },
  ".range": {
    post: ([end]) => ({ node: ["_", ...Array(end).keys()] }),
  },
};
