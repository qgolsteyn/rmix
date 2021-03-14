#!/usr/bin/env node
const yargs = require("yargs/yargs");

const process = require("process");

const { build } = require("./src/build");

yargs(process.argv.slice(2))
  .usage("Usage: $0 <command> [options]")
  .command(
    "run <file> [output]",
    "Run a rmix file",
    (yargs) =>
      yargs
        .positional("file", {
          describe: "entrypoint file ",
          default: "index.rem",
        })
        .positional("output", {
          describe: "output file",
          default: "out.rem",
        }),
    (argv) => {
      build(argv.file, argv.output);
    }
  )
  .example(
    "$0 run index.rem out.rem",
    "Run the file located at index.rem and output at out.rem"
  )
  .help("h")
  .alias("h", "help").argv;
