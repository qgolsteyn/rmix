const path = require("path");
const fs = require("fs");

const rmix = require("rmix");
const scope = require("rmix-node");

const build = (file, out) => {
  const output = rmix(
    ["_", ["node.stringify", ["node.import", path.join(process.cwd(), file)]]],
    scope
  )[1];

  fs.writeFileSync(path.join(process.cwd(), out), output + "\n");
};

module.exports = {
  build,
};
