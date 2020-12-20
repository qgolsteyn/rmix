import { RmixDefinition } from "../types";

const boolean: Record<string, RmixDefinition> = {
  ".and": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc && item === "T", true) ? "T" : "F",
      ],
    }),
  },
  ".or": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc || item === "T", false) ? "T" : "F",
      ],
    }),
  },
};

export default boolean;
