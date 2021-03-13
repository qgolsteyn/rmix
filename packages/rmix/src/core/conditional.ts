import { RmixDefinition } from "../types";

const conditional: Record<string, RmixDefinition> = {
  "?": {
    pre: ([cond, truthy, falsy]) => {
      return {
        node: [
          "?.inner",
          cond,
          ["truthy", ["'", truthy]],
          ["falsy", ["'", falsy]],
        ],
      };
    },
    namespace: {
      inner: {
        post: ([cond, truthy, falsy]) => {
          if (!Array.isArray(truthy)) {
            throw new Error("Invariant violation: truthy must be an array");
          }

          if (!Array.isArray(falsy)) {
            throw new Error("Invariant violation: falsy must be an array");
          }

          if (cond === "T") {
            return { node: ["_", ...truthy.slice(1)] };
          } else if (cond === "F") {
            return { node: ["_", ...falsy.slice(1)] };
          } else {
            throw new Error("Invariant violation: cond must be a boolean.");
          }
        },
      },
    },
  },
  "==": { post: ([a, b]) => ({ node: a === b ? ["_", "T"] : ["_", "F"] }) },
  "!=": { post: ([a, b]) => ({ node: a !== b ? ["_", "T"] : ["_", "F"] }) },
  ">=": { post: ([a, b]) => ({ node: a >= b ? ["_", "T"] : ["_", "F"] }) },
  "<=": { post: ([a, b]) => ({ node: a <= b ? ["_", "T"] : ["_", "F"] }) },
  ">": { post: ([a, b]) => ({ node: a > b ? ["_", "T"] : ["_", "F"] }) },
  "<": { post: ([a, b]) => ({ node: a < b ? ["_", "T"] : ["_", "F"] }) },
  ".and": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc && item === "T", true) ? "T" : "F",
      ],
    }),
  },
  ".or": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc || item === "T", false) ? "T" : "F",
      ],
    }),
  },
};

export default conditional;
