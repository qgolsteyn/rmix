#!/usr/bin/env node
const yargs = require("yargs/yargs");

const process = require("process");

const { test } = require("./src/testing");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 <command> [options]")
  .command(
    "test",
    "Run a rmix test suite",
    (yargs) =>
      yargs.positional("file", {
        describe: "entrypoint for test suite",
        default: "test/index.rem",
      }),
    (argv) => {
      test(argv.file);
    }
  )
  .example("$0 test foo.rem", "Run the test suite located at test/index.rem")
  .help("h")
  .alias("h", "help").argv;
