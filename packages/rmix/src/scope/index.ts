import { RmixDefinition } from "../types";
import def from "./def";
import comment from "./comment";
import math from "./math";
import list from "./list";
import conditional from "./conditional";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...math,
  ...list,
  ...conditional,
};

export default core;
