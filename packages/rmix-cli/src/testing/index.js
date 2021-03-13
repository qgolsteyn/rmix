const path = require("path");
const signale = require("signale");

const rmix = require("rmix");
const scope = require("rmix-node");

const test = (file) => {
  rmix(
    [
      "_",
      ["node.import", path.join(__dirname, "./testing.rem")],
      ["node.import", path.join(process.cwd(), file)],
    ],
    {
      ...scope,
      test: {
        namespace: {
          success: {
            post: (tail) => {
              signale.success(tail.join(" > "));
              return { node: ["_"] };
            },
          },
          failure: {
            post: (tail) => {
              signale.fatal(tail.join(" > "));
              return { node: ["_"] };
            },
          },
        },
      },
    }
  );
};

module.exports = {
  test,
};
