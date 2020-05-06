import { def } from "./def";
import { process } from "./process";

export const primitives = {
  "#def": def,
  "#?": (node, scope) => {
    const cond = process(node[1], scope)[1];
    if (cond === "T") {
      return process(["_", node[2]], scope);
    } else if (cond === "F") {
      return process(["_", node[3]], scope);
    } else {
      throw new Error("Invalid symbol for conditional");
    }
  },
};
