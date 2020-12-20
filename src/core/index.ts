import { RemixDefinition } from "../types/Definition";
import boolean from "./boolean";
import conditional from "./conditional";
import math from "./math";
import def from "./def";
import list from "./list";
import comment from "./comment";

const core: Record<string, RemixDefinition> = {
  ...comment,
  ...def,
  ...list,
  ...conditional,
  ...boolean,
  ...math,
};

export default core;
