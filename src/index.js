import core from "./core";
import process from "./process";

export const remix = (node, scope = {}) =>
  process(["_", node], {
    ...core,
    ...scope,
  });
