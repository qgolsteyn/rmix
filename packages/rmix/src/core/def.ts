import { RmixDefinition, RmixDefinitionFunction, RmixNode } from "../types";

const defFunction = (type: "pre" | "post"): RmixDefinitionFunction => (
  [tag, ...map],
  scope
) => ({
  node: ["_"],
  siblingScope: {
    [tag as string]: {
      [type]: (tail: RmixNode) => ({
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

const def: Record<string, RmixDefinition> = {
  def: {
    post: defFunction("post"),
    namespace: {
      pre: {
        post: defFunction("pre"),
      },
      post: {
        post: defFunction("post"),
      },
    },
  },
  defn: {
    pre: defFunction("post"),
    namespace: {
      pre: {
        pre: defFunction("pre"),
      },
      post: {
        pre: defFunction("post"),
      },
    },
  },
  apply: {
    post: (tail) => ({ node: ["_", tail] }),
  },
};

export default def;
