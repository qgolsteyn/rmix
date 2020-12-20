import core from "./core/index";
import process from "./process";
import { RemixDefinition } from "./types/Definition";
import { RemixNode } from "./types/RemixNode";

export const remix = (
  node: RemixNode,
  scope: Record<string, RemixDefinition> = {}
) =>
  process(["_", node], {
    ...core,
    ...scope,
  });
