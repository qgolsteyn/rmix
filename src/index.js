import core from "./core";
import { process } from "./process";
import runtime from "./runtime";

export const remix = (node, scope = {}) =>
  process(["_", ...runtime, node], { ...core, ...scope }).node;
