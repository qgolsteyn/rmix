import { process } from "./process";

import { primitives } from "./primitives";
import { stdScope } from "./std";

export const remix = (node, scope = {}) =>
  process(node, { ...stdScope, ...primitives, ...scope });
