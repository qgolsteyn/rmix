import { createNode } from "../core/createNode";

export default {
  "string/join": (scope) =>
    createNode(undefined, [scope.children.join(" ")], scope),
};
