import { namespace } from "rmix";

import compare from "./compare";
import importRemix from "./import";
import parse from "./parse";
import stringify from "./stringify";

export default namespace("node", {
  ...importRemix,
  ...parse,
  ...stringify,
  ...compare,
});
