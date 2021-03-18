import { def as defAPI } from "../api";
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
          "#": defAPI.post(() => ["'", ...tail]),
          "#!": defAPI.post(() => ["_", ...tail]),
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
  apply: defAPI.post((tail) => ["_", tail]),
};

export default def;
