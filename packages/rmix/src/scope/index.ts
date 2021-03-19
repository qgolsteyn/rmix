import { RmixDefinition } from "../types";
import conditional from "./conditional";
import math from "./math";
import def from "./def";
import list from "./list";
import comment from "./comment";
import parse from "./parse";
import stringify from "./stringify";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...list,
  ...conditional,
  ...math,
  ...parse,
  ...stringify,
};

export default core;
