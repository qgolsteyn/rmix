import { createNode } from "./core/createNode";
import { process } from "./core";

export default async (args) => {
  console.time();
  process(
    createNode(undefined, ["_", ["load", "base.rem"]], {
      input: () => createNode(undefined, [args.input]),
    })
  );
  console.timeEnd();
};
