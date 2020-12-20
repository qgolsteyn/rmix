import { remix } from "../src";
import * as path from "path";
import scope from "./lib";

console.time();
console.log(
  JSON.stringify(
    remix([".import", path.join(__dirname, "./index.rem")], scope),
    null,
    2
  )
);
console.timeEnd();
