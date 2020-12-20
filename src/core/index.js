import boolean from "./boolean";
import conditional from "./conditional";
import math from "./math";
import def from "./def";

import list from "./list";
import comment from "./comment";

export default {
  ...comment,
  ...def,
  ...list,
  ...conditional,
  ...boolean,
  ...math,
};
