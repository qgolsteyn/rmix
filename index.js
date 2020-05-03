require = require("esm")(module);

remix = require("./remix.js").default;

require("yargs").command(
  "$0 [input]",
  "",
  (yargs) => {
    yargs.positional("input", {
      describe: "input file to process",
      default: "example.rem",
    });
  },
  remix
).argv;
