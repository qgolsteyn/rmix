import { def } from "../api";
import { RmixDefinition } from "../types";

const list: Record<string, RmixDefinition> = {
  list: {
    namespace: {
      head: def.post((node) => ["_", node[0]]),
      tail: def.post((node) => ["_", ...node.slice(1)]),
      len: def.post((node) => ["_", node.length]),
      get: def.post((node) => {
        if (typeof node[0] !== "number") {
          throw new Error("Invariant violation: element must be an integer");
        }

        return ["_", node.slice(1)[node[0]]];
      }),
      map: def.post(([tag, ...list]) => [
        "_",
        ...list.map((item) => [tag, item]),
      ]),
      range: def.post(([end]) => {
        if (typeof end !== "number") {
          throw new Error("Invariant violation: end is not a number");
        }
        return ["_", ...Array(end).keys()];
      }),
    },
  },
};

export default list;
