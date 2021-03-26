import { def } from "../api";
import { createNode } from "../core/node";
import { RmixDefinition } from "../types";

const comment: Record<string, RmixDefinition> = {
  ";": def.post(() => createNode("_")),
};

export default comment;
