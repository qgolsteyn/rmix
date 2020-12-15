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

test({ input: "./example/listOperations.rem" });
