import { RmixNode } from "./RmixNode";

export interface RmixDefinitionObject {
  node: RmixNode;
  siblingScope?: Record<string, RmixDefinition>;
  innerScope?: Record<string, RmixDefinition>;
}

export type RmixDefinitionFunction = (
  tail: RmixNode,
  scope: Record<string, RmixDefinition>
) => RmixDefinitionObject;

export type RmixDefinition = {
  post?: RmixDefinitionFunction;
  pre?: RmixDefinitionFunction;
};
