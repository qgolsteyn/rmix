import { RemixDefinition } from "../types/Definition";

const list: Record<string, RemixDefinition> = {
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
    post: (node) => {
      if (typeof node[0] !== "number") {
        throw new Error("Invariant violation: element must be an integer");
      }

      return { node: ["_", node.slice(1)[node[0]]] };
    },
  },
  ".map": {
    post: ([tag, ...list]) => ({
      node: ["_", ...list.map((item) => [tag, item])],
    }),
  },
  ".range": {
    post: ([end]) => {
      if (typeof end !== "number") {
        throw new Error("Invariant violation: end is not a number");
      }
      return { node: ["_", ...Array(end).keys()] };
    },
  },
};

export default list;
