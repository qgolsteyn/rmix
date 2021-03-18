import { def } from "../api";
import { RmixDefinition } from "../types";

const comment: Record<string, RmixDefinition> = {
  ";": def.post(() => ["_"]),
};

export default comment;
