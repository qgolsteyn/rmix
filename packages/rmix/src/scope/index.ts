import { RmixDefinition } from "../types";
import def from "./def";
import comment from "./comment";
import math from "./math";
import list from "./list";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...math,
  ...list,
};

export default core;
