import { RmixDefinition } from "../types";
import conditional from "./conditional";
import math from "./math";
import def from "./def";
import list from "./list";
import comment from "./comment";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...list,
  ...conditional,
  ...math,
};

export default core;
