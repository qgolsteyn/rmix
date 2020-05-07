import { load } from "./load";
import { parse } from "./parser";
import { parseJSON } from "./json";

export const stdScope = {
  parse,
  parseJSON,
  load,
  ";": () => ["_"],
  filter: (node) => {
    const match = [];
    for (const item of node.slice(2)) {
      if (Array.isArray(item) && item[0] === node[1]) {
        match.push(item);
      }
    }

    return ["_", ...match];
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
