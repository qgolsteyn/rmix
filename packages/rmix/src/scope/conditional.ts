import { def } from "../api";
import { RmixDefinition } from "../types";

const conditional: Record<string, RmixDefinition> = {
  "?": {
    ...def.pre(([cond, truthy, falsy]) => [
      "?.inner",
      cond,
      ["truthy", ["'", truthy]],
      ["falsy", ["'", falsy]],
    ]),
    namespace: {
      inner: def.post(([cond, truthy, falsy]) => {
        if (!Array.isArray(truthy)) {
          throw new Error("Invariant violation: truthy must be an array");
        }

        if (!Array.isArray(falsy)) {
          throw new Error("Invariant violation: falsy must be an array");
        }

        if (cond === "T") {
          return ["_", ...truthy.slice(1)];
        } else if (cond === "F") {
          return ["_", ...falsy.slice(1)];
        } else {
          throw new Error("Invariant violation: cond must be a boolean.");
        }
      }),
    },
  },
  "==": def.post(([a, b]) => (a === b ? ["_", "T"] : ["_", "F"])),
  "!=": def.post(([a, b]) => (a !== b ? ["_", "T"] : ["_", "F"])),
  ">=": def.post(([a, b]) => (a >= b ? ["_", "T"] : ["_", "F"])),
  "<=": def.post(([a, b]) => (a <= b ? ["_", "T"] : ["_", "F"])),
  ">": def.post(([a, b]) => (a > b ? ["_", "T"] : ["_", "F"])),
  "<": def.post(([a, b]) => (a < b ? ["_", "T"] : ["_", "F"])),
  and: def.post((tail) => [
    "_",
    tail.reduce((acc, item) => acc && item === "T", true) ? "T" : "F",
  ]),

  or: def.post((tail) => [
    "_",
    tail.reduce((acc, item) => acc || item === "T", false) ? "T" : "F",
  ]),
  isSymbol: def.post(([value]) => {
    return ["_", typeof value === "string" ? "T" : "F"];
  }),
  isNode: def.post(([value]) => {
    return ["_", Array.isArray(value) ? "T" : "F"];
  }),
  isNumber: def.post(([value]) => {
    return ["_", typeof value === "number" ? "T" : "F"];
  }),
};

export default conditional;
