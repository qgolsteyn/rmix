import { RemixDefinition } from "../types/Definition";

const boolean: Record<string, RemixDefinition> = {
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
