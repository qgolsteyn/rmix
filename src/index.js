import core from "./core";
import process from "./process";
import runtime from "./runtime/entrypoint";

export const remix = (node, scope = {}) =>
  process(["_", [".defn", "entrypoint", node], ...runtime], {
    ...core,
    ...scope,
  });
