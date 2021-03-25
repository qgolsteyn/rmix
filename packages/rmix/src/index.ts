import coreScope from "./scope";
import process from "./core/process";
import { RmixDefinition, RmixNode } from "./types";

export {
  RmixDefinition,
  RmixDefinitionFunction,
  RmixDefinitionObject,
  RmixNode,
} from "./types";

export { def, namespace } from "./api";
export {
  createNode,
  createNodeFromArray,
  createArrayFromNode,
} from "./core/node";

const rmix = (node: RmixNode, scope: Record<string, RmixDefinition> = {}) =>
  process(node, {
    ...coreScope,
    ...scope,
  });

export default rmix;
