import { def as defAPI } from "../api";
import { RmixDefinition, RmixDefinitionFunction, RmixNode } from "../types";

const defFunction = (type: "pre" | "post"): RmixDefinitionFunction => (
  [tag, ...map],
  scope
) => {
  if (typeof tag !== "string") {
    throw new Error("Invariant violation: tag must be a string");
  }

  const [baseTag, ...tags] = tag.split(">").reverse();

  let base: Record<string, RmixDefinition> = {
    [baseTag]: {
      [type]: (tail: RmixNode) => ({
        node: ["_", ...map],
        innerScope: {
          ...scope,
          "#": defAPI.post(() => ["'", ...tail]),
          "#!": defAPI.post(() => ["_", ...tail]),
        },
      }),
    },
  };

  for (const enterTag of tags) {
    base = {
      [enterTag]: {
        enter: base,
      },
    };
  }

  return {
    node: ["_"],
    siblingScope: base,
  };
};

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
