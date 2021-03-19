import { def, namespace } from "../api";
import { RmixDefinition } from "../types";

const math: Record<string, RmixDefinition> = {
  "+": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return acc + item;
    }),
  ]),
  "-": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return acc - item;
    }),
  ]),
  "*": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return acc * item;
    }),
  ]),
  "/": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return acc / item;
    }),
  ]),
  "%": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return acc / item;
    }),
  ]),
  "++": def.post((tail) => [
    "_",
    ...tail.map((item) => {
      if (typeof item !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return item + 1;
    }),
  ]),
  "--": def.post((tail) => [
    "_",
    ...tail.map((item) => {
      if (typeof item !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return item - 1;
    }),
  ]),
  "**": def.post((tail) => [
    "_",
    tail.reduce((acc, item) => {
      if (typeof item !== "number" || typeof acc !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }
      return Math.pow(acc, item);
    }),
  ]),
  ...namespace("math", {
    E: def.post(() => ["_", Math.E]),
    LN2: def.post(() => ["_", Math.LN2]),
    LN10: def.post(() => ["_", Math.LN10]),
    PI: def.post(() => ["_", Math.PI]),
    abs: def.post((tail) => [
      "_",
      ...tail.map((item) => {
        if (typeof item !== "number") {
          throw new Error("Invariant violation: item of list must be a number");
        }
        return Math.abs(item);
      }),
    ]),
  }),
};

export default math;
