import { remix } from "./core";

export default async (args) => {
  console.time();
  console.log(
    JSON.stringify(
      remix(["_", ["load", "base.rem"]], { input: () => ["_", args.input] }),
      null,
      2
    )
  );

  console.timeEnd();
};
