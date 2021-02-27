import { RmixDefinition } from "../types";
import conditional from "./conditional";
import math from "./math";
import def from "./def";
import list from "./list";
import comment from "./comment";
import rmxConsole from "./console";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...list,
  ...conditional,
  ...math,
  ...rmxConsole,
};

export default core;
