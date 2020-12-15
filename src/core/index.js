import boolean from "./boolean";
import conditional from "./conditional";
import math from "./math";
import { def } from "./def";
import { importRemix } from "./import";
import { parse } from "./parse";
import list from "./list";

export default {
  def,
  ...list,
  ...conditional,
  ...boolean,
  ...math,
  import: importRemix,
  parse,
};
