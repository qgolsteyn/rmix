import { RemixDefinition, RemixDefinitionFunction } from "../types/Definition";
import { RemixNode } from "../types/RemixNode";

const defFunction = (type: "pre" | "post"): RemixDefinitionFunction => (
  [tag, ...map],
  scope
) => ({
  node: ["_"],
  siblingScope: {
    [tag as string]: {
      [type]: (tail: RemixNode) => ({
        node: ["_", ...map],
        innerScope: {
          ...scope,
          "#": {
            post: () => {
              return { node: ["'", ...tail] };
            },
          },
          "#!": {
            post: () => {
              return { node: ["_", ...tail] };
            },
          },
        },
      }),
    },
  },
});

const def: Record<string, RemixDefinition> = {
  ".def": {
    post: defFunction("post"),
  },
  ".defn": {
    pre: defFunction("post"),
  },
  ".predef": {
    post: defFunction("pre"),
  },
  ".predefn": {
    pre: defFunction("pre"),
  },
  ".apply": {
    post: (tail) => ({ node: ["_", tail] }),
  },
};

export default def;
