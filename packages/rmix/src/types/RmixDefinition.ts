import { RmixNode } from "./RmixNode";

export interface RmixDefinitionObject {
  node: RmixNode;
  siblingScope?: Record<string, RmixDefinition>;
  innerScope?: Record<string, RmixDefinition>;
}

export type RmixDefinitionFunction = (
  tail: RmixNode | undefined
) => RmixDefinitionObject;

export type RmixDefinition = {
  post?: RmixDefinitionFunction;
  pre?: RmixDefinitionFunction;
};
