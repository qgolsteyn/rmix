import * as path from "path";

import rmix from "rmix";
import scope from "./lib/index";

console.time();
console.log(
  JSON.stringify(
    rmix(
      [
        "_",
        [".import", path.join(__dirname, "./testing.rem")],
        [".import", ["input"]],
      ],
      scope
    ),
    null,
    2
  )
);
console.timeEnd();
