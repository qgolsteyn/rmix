const path = require("path");
const fs = require("fs");

const { default: rmix } = require("rmix");

const run = (file, out) => {
  const input = fs.readFileSync(path.join(process.cwd(), file), "utf-8");

  const output = rmix(["_", ["rmix.stringify", ["rmix.parse", input]]])[1];

  fs.writeFileSync(path.join(process.cwd(), out), output + "\n");
};

module.exports = {
  run,
};
