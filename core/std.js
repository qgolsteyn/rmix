import { load, parse } from "./load";
import { process } from "./process";

export const stdScope = {
  parse,
  load,
  "?": (node, scope) => {
    if (node[1] === "T") {
      return process(["_", node[2]], scope);
    } else if (node[1] === "F") {
      return process(["_", node[3]], scope);
    } else {
      throw new Error("Invalid symbol for conditional");
    }
  },
  "==": (node) => (node[1] === node[2] ? ["_", "T"] : ["_", "F"]),
  "!=": (node) => (node[1] !== node[2] ? ["_", "T"] : ["_", "F"]),
  ">=": (node) => (node[1] >= node[2] ? ["_", "T"] : ["_", "F"]),
  "<=": (node) => (node[1] <= node[2] ? ["_", "T"] : ["_", "F"]),
  ">": (node) => (node[1] > node[2] ? ["_", "T"] : ["_", "F"]),
  "<": (node) => (node[1] < node[2] ? ["_", "T"] : ["_", "F"]),
  "+": (node) => node.slice(1).reduce((acc, val) => acc + val),
  "-": (node) => node.slice(1).reduce((acc, val) => acc - val),
  "*": (node) => node.slice(1).reduce((acc, val) => acc * val),
  "/": (node) => node.slice(1).reduce((acc, val) => acc / val),
};
