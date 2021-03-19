import { def, namespace } from "../api";
import { RmixDefinition } from "../types";

const list: Record<string, RmixDefinition> = namespace("list", {
  head: def.post((node) => ["_", node[0]]),
  tail: def.post((node) => ["_", ...node.slice(1)]),
  len: def.post((node) => ["_", node.length]),
  spread: def.post((node) => {
    if (Array.isArray(node[0])) {
      return ["_", ...node[0]];
    } else {
      return ["_"];
    }
  }),
  get: def.post((node) => {
    if (typeof node[0] !== "number") {
      throw new Error("Invariant violation: element must be an integer");
    }

    return ["_", node.slice(1)[node[0]]];
  }),
  map: def.post(([tag, ...list]) => ["_", ...list.map((item) => [tag, item])]),
  filter: def.post(([tag, ...list]) => [
    "_",
    ...list.map((item) => ["?", [tag, item], item]),
  ]),
  range: def.post(([end]) => {
    if (typeof end !== "number") {
      throw new Error("Invariant violation: end is not a number");
    }
    return ["_", ...Array(end).keys()];
  }),
});

export default list;
