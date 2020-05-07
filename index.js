require = require("esm")(module);

const { remix } = require("./core");
const { toJson, toFile } = require("./output");

const parse = (input, options = {}) => {
  options = { output: "remix", outputPath: undefined, ...options };

  const output = remix(["_", input]);

  let mappedOutput = output;
  switch (options.output) {
    case "remix":
    case "rem":
      mappedOutput = output;
      break;
    case "json":
      mappedOutput = toJson(output);
      break;
    default:
      mappedOutput = output;
      break;
  }

  if (options.outputPath) {
    toFile(mappedOutput, options.outputPath);
  }

  return mappedOutput;
};

module.exports = {
  parse,
  parseJSON: (input, options = {}) =>
    parse(["parseJSON", JSON.stringify(input)], options),
  parseFile: (filePath, options = {}) =>
    parse(["load", "./" + filePath], options),
  cli: (args) =>
    console.log(JSON.stringify(remix(["_", ["load", args.input]]), null, 2)),
};
