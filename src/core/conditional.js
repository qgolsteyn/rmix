export default {
  "?": {
    pre: ([cond, truthy, falsy]) => {
      return {
        node: ["??", cond, ["truthy", ["'", truthy]], ["falsy", ["'", falsy]]],
      };
    },
  },
  "??": {
    post: ([cond, truthy, falsy]) => {
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
