import * as path from "path";

import { remix } from "../src/index";
import scope from "./lib/index";

console.time();
console.log(
  JSON.stringify(
    remix([".import", path.join(__dirname, "./index.rem")], scope),
    null,
    2
  )
);
console.timeEnd();
