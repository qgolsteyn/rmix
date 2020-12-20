import { RemixDefinition } from "../types/Definition";

const comment: Record<string, RemixDefinition> = {
  ";": {
    post: () => ({ node: ["_"] }),
  },
};

export default comment;
