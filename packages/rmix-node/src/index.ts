import { namespace } from "rmix";

import compare from "./compare";
import importRemix from "./import";

export default namespace("node", {
  ...importRemix,
  ...compare,
});
