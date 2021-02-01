const path = require("path");
const signale = require("signale");

const rmix = require("rmix");
const scope = require("rmix-node");

const test = (file) => {
  rmix(
    [
      "_",
      [".import", path.join(__dirname, "./testing.rem")],
      [".import", path.join(process.cwd(), file)],
    ],
    {
      ...scope,
      ".test.success": {
        post: (tail) => {
          signale.success(tail.join(" > "));
          return { node: ["_"] };
        },
      },
      ".test.failure": {
        post: (tail) => {
          signale.fatal(tail.join(" > "));
          return { node: ["_"] };
        },
      },
    }
  );
};

module.exports = {
  test,
};
