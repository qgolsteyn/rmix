import { process } from "../process";

export default {
  "?": {
    pre: ([cond, truthy, falsy], scope) => {
      const { node } = process(["_", cond], scope);
      if (node[1] === "T") {
        return { node: ["_", truthy] };
      } else if (node[1] === "F") {
        return { node: ["_", falsy] };
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
