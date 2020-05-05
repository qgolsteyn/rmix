import { stdScope } from "./std";
import { process } from "./process";

export const remix = (node, scope = {}) =>
  process(node, { ...stdScope, ...scope });
