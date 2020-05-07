import { process } from "./process";

const jsonVisitor = (node) => {
  if (Array.isArray(node)) {
    return ["_", ...node.map((item) => jsonVisitor(item))];
  } else if (typeof node === "object") {
    return [
      "@",
      ...Object.entries(node).map((item) => [item[0], jsonVisitor(item[1])]),
    ];
  } else {
    return node;
  }
};

export const parseJSON = (node, scope) =>
  process(jsonVisitor(JSON.parse(node[1])), scope);
