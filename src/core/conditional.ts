import { RemixDefinition } from "../types/Definition";

const conditional: Record<string, RemixDefinition> = {
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
  },
  "?.inner": {
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
  "==": { post: ([a, b]) => ({ node: a === b ? ["_", "T"] : ["_", "F"] }) },
  "!=": { post: ([a, b]) => ({ node: a !== b ? ["_", "T"] : ["_", "F"] }) },
  ">=": { post: ([a, b]) => ({ node: a >= b ? ["_", "T"] : ["_", "F"] }) },
  "<=": { post: ([a, b]) => ({ node: a <= b ? ["_", "T"] : ["_", "F"] }) },
  ">": { post: ([a, b]) => ({ node: a > b ? ["_", "T"] : ["_", "F"] }) },
  "<": { post: ([a, b]) => ({ node: a < b ? ["_", "T"] : ["_", "F"] }) },
};

export default conditional;
