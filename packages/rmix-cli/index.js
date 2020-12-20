#!/usr/bin/env node
const yargs = require("yargs/yargs");
const path = require("path");
const process = require("process");

const rmix = require("rmix");
const scope = require("rmix-node");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 <command> [options]")
  .command("run", "Run a rmix file")
  .example("$0 run -f foo.rem", "run foo.rem")
  .alias("f", "file")
  .nargs("f", 1)
  .describe("f", "run a file")
  .demandOption(["f"])
  .help("h")
  .alias("h", "help").argv;

console.log(
  JSON.stringify(
    rmix(
      [
        "_",
        [".import", path.join(__dirname, "./src/testing.rem")],
        [".import", path.join(process.cwd(), argv.file)],
      ],
      scope
    ),
    null,
    2
  )
);
