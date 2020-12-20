import { RmixDefinition } from "../types";

const comment: Record<string, RmixDefinition> = {
  ";": {
    post: () => ({ node: ["_"] }),
  },
};

export default comment;
