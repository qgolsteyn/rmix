import _ from "lodash";
import { def as defAPI, namespace } from "../api";
import { createNode } from "../core/node";
import { RmixDefinition, RmixDefinitionFunction, RmixNode } from "../types";

const defFunction = (type: "pre" | "post"): RmixDefinitionFunction => (
  tagNode,
  scope
) => {
  const tag = tagNode?.value;
  if (typeof tag !== "string") {
    throw new Error("Invariant violation: tag must be a string");
  }

  return {
    node: createNode("_"),
    siblingScope: {
      [tag]: {
        [type]: (tail: RmixNode) => ({
          node: createNode("_", _.cloneDeep(tagNode?.next)),
          innerScope: {
            ...scope,
            "#": defAPI.post(() => createNode("'", _.cloneDeep(tail))),
            "#!": defAPI.post(() => createNode("_", _.cloneDeep(tail))),
          },
        }),
      },
    },
  };
};

const def: Record<string, RmixDefinition> = {
  def: {
    post: defFunction("post"),
  },
  ...namespace("def", {
    pre: {
      post: defFunction("pre"),
    },
    post: {
      post: defFunction("post"),
    },
  }),
  defn: {
    pre: defFunction("post"),
  },
  ...namespace("defn", {
    pre: {
      pre: defFunction("pre"),
    },
    post: {
      pre: defFunction("post"),
    },
  }),
  apply: defAPI.post((tail) => createNode("_", tail)),
};

export default def;
