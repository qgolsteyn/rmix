import core from "./core/index";
import process from "./process";
import { RmixDefinition, RmixNode } from "./types";

export {
  RmixDefinition,
  RmixDefinitionFunction,
  RmixDefinitionObject,
  RmixNode,
} from "./types";

const rmix = (node: RmixNode, scope: Record<string, RmixDefinition> = {}) =>
  process(["_", node], {
    ...core,
    ...scope,
  });

export default rmix;
