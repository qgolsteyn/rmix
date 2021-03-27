import { def, rmixNode } from "../api";
import { RmixDefinition } from "../types";

const comment: Record<string, RmixDefinition> = {
  ";": def.post(() => rmixNode.createNode("_")),
};

export default comment;
