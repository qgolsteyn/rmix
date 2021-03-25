import { RmixDefinition } from "../types";
import def from "./def";
import comment from "./comment";
import math from "./math";
import list from "./list";
import conditional from "./conditional";
import parse from "./parse";
import stringify from "./stringify";

const core: Record<string, RmixDefinition> = {
  ...comment,
  ...def,
  ...math,
  ...list,
  ...conditional,
  ...parse,
  ...stringify,
};

export default core;
