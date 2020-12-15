import * as path from "path";

import { remix } from "./src";

const test = (args) => {
  console.time();
  console.log(
    JSON.stringify(
      remix(["_", ["import", ["input"]]], {
        input: {
          post: () => ({
            node: ["_", args.input],
          }),
        },
      }),
      null,
      2
    )
  );
  console.timeEnd();
};

test({ input: path.join(__dirname, "./example/index.rem") });
