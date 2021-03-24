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

const rmix = (node: RmixNode, scope: Record<string, RmixDefinition> = {}) =>
  process(["_", node], {
    ...coreScope,
    ...scope,
  });

export default rmix;
