import coreScope from "./scope";
import process from "./core/process";
import { RmixArray, RmixDefinition, RmixNode } from "./types";
import { createNodeFromArray, createArrayFromNode } from "./core/node";

export {
  RmixDefinition,
  RmixDefinitionFunction,
  RmixDefinitionObject,
  RmixNode,
  RmixArray,
} from "./types";

export { def, namespace } from "./api";
export {
  createNode,
  createNodeFromArray,
  createArrayFromNode,
} from "./core/node";

const rmix = (
  node: RmixArray,
  scope: Record<string, RmixDefinition> = {}
): RmixArray =>
  createArrayFromNode(
    process(createNodeFromArray(node), {
      ...coreScope,
      ...scope,
    })
  );

export default rmix;
