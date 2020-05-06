import { load, parse } from "./load";
import { process } from "./process";

export const stdScope = {
  parse,
  load,
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
