import _ from "lodash";
import { def as defAPI, namespace, rmixNode } from "../api";
import { RmixDefinition, RmixDefinitionFunction, RmixNode } from "../types";

const defFunction = (type: "pre" | "post"): RmixDefinitionFunction => (
  tagNode
) => {
  const tag = tagNode?.value;
  if (typeof tag !== "string") {
    throw new Error("Invariant violation: tag must be a string");
  }

  return {
    node: rmixNode.createNode("_"),
    siblingScope: {
      [tag]: {
        [type]: (tail: RmixNode) => ({
          node: rmixNode.createNode("_", _.cloneDeep(tagNode?.next)),
          innerScope: {
            "#": defAPI.post(() => rmixNode.createNode("'", _.cloneDeep(tail))),
            "#!": defAPI.post(() =>
              rmixNode.createNode("_", _.cloneDeep(tail))
            ),
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
  apply: defAPI.post((tail) => rmixNode.createNode("_", tail)),
};

export default def;
