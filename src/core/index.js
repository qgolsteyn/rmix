import boolean from "./boolean";
import conditional from "./conditional";
import math from "./math";
import { def } from "./def";
import { load } from "./load";
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
  load: { map: load },
  parse: { map: parse },
};
