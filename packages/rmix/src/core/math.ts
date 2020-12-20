import { RmixDefinition } from "../types";

const math: Record<string, RmixDefinition> = {
  "+": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a string or number"
            );
          }
          return acc + item;
        }),
      ],
    }),
  },
  "-": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a string or number"
            );
          }
          return acc - item;
        }),
      ],
    }),
  },
  "*": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a string or number"
            );
          }
          return acc * item;
        }),
      ],
    }),
  },
  "/": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a string or number"
            );
          }
          return acc / item;
        }),
      ],
    }),
  },
};

export default math;