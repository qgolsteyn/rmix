import coreScope from "./scope";
import process from "./core/process";
import { RmixArray, RmixDefinition } from "./types";
import { createNodeFromArray, createArrayFromNode } from "./api/rmixNode";

export {
  RmixDefinition,
  RmixDefinitionFunction,
  RmixDefinitionObject,
  RmixNode,
  RmixArray,
} from "./types";

export { def, namespace, rmixNode } from "./api";

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
