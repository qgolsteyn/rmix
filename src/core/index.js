import boolean from "./boolean";
import conditional from "./conditional";
import math from "./math";
import { def } from "./def";
import { importRemix } from "./import";
import { parse } from "./parse";
import list from "./list";
import { apply } from "./apply";

export default {
  def: { preMap: def },
  apply: { map: apply },
  ...list,
  ...conditional,
  ...boolean,
  ...math,
  import: { map: importRemix },
  parse: { map: parse },
};
