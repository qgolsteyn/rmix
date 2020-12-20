import { RemixNode } from "./RemixNode";

export interface RemixDefinitionObject {
  node: RemixNode;
  siblingScope?: Record<string, RemixDefinition>;
  innerScope?: Record<string, RemixDefinition>;
}

export type RemixDefinitionFunction = (
  tail: RemixNode,
  scope: Record<string, RemixDefinition>
) => RemixDefinitionObject;

export type RemixDefinition = {
  post?: RemixDefinitionFunction;
  pre?: RemixDefinitionFunction;
};
