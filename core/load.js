import * as proc from "process";
import * as fs from "fs";
import * as path from "path";

import { process } from "./process";

export const load = (node, scope) => {
  const dirname = scope.dirname ? scope.dirname(node, scope)[1] : proc.cwd();

  let filePath = "";
  if (node[1].slice(0, 2) === "./" || node[1].slice(0, 3) === "../") {
    filePath = path.resolve(dirname, node[1]);
  } else if (node[1].slice(0, 1) === "/") {
    filePath = path.resolve(node[1]);
  } else {
    filePath = path.resolve("node_modules", node[1]);
  }

  const extension = path.extname(node[1]);

  if (extension === ".rem") {
    const oldDirname = scope.dirname;
    const oldFilename = scope.filename;

    scope.dirname = () => ["_", path.dirname(filePath)];
    scope.filename = () => ["_", filePath];

    const output = process(
      ["parse", "(" + fs.readFileSync(filePath, "utf-8") + ")"],
      scope
    );

    scope.dirname = oldDirname;
    scope.filename = oldFilename;

    return output;
  } else if (extension === ".json") {
    const oldDirname = scope.dirname;
    const oldFilename = scope.filename;

    scope.dirname = () => ["_", path.dirname(filePath)];
    scope.filename = () => ["_", filePath];

    const output = process(
      ["parseJSON", fs.readFileSync(filePath, "utf-8")],
      scope
    );

    scope.dirname = oldDirname;
    scope.filename = oldFilename;

    return output;
  } else if (extension === ".js") {
    const lib = require(filePath).default;
    for (const key of Object.keys(lib)) {
      scope[key] = lib[key];
    }
    return ["_"];
  } else {
    throw `Unknown extension: ${node[1]}`;
  }
};
