import { RmixDefinition } from "../types";

const math: Record<string, RmixDefinition> = {
  "+": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a number"
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
              "Invariant violation: item of list must be a number"
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
              "Invariant violation: item of list must be a number"
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
              "Invariant violation: item of list must be a number"
            );
          }
          return acc / item;
        }),
      ],
    }),
  },
  "%": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a number"
            );
          }
          return acc / item;
        }),
      ],
    }),
  },
  "++": {
    post: (tail) => ({
      node: [
        "_",
        ...tail.map((item) => {
          if (typeof item !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a number"
            );
          }
          return item + 1;
        }),
      ],
    }),
  },
  "--": {
    post: (tail) => ({
      node: [
        "_",
        ...tail.map((item) => {
          if (typeof item !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a number"
            );
          }
          return item - 1;
        }),
      ],
    }),
  },
  "**": {
    post: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => {
          if (typeof item !== "number" || typeof acc !== "number") {
            throw new Error(
              "Invariant violation: item of list must be a number"
            );
          }
          return Math.pow(acc, item);
        }),
      ],
    }),
  },
  math: {
    namespace: {
      E: {
        post: () => ({
          node: ["_", Math.E],
        }),
      },
      LN2: {
        post: () => ({
          node: ["_", Math.LN2],
        }),
      },
      LN10: {
        post: () => ({
          node: ["_", Math.LN10],
        }),
      },
      PI: {
        post: () => ({
          node: ["_", Math.PI],
        }),
      },
      abs: {
        post: (tail) => ({
          node: [
            "_",
            ...tail.map((item) => {
              if (typeof item !== "number") {
                throw new Error(
                  "Invariant violation: item of list must be a number"
                );
              }
              return Math.abs(item);
            }),
          ],
        }),
      },
    },
  },
};

export default math;
