import * as proc from "process";
import * as fs from "fs";
import * as path from "path";

export const importRemix = ([filename], scope) => {
  const dirname = scope.dirname ? scope.dirname.value : proc.cwd();

  let filePath = "";
  if (filename.slice(0, 2) === "./" || filename.slice(0, 3) === "../") {
    filePath = path.resolve(dirname, filename);
  } else if (filename.slice(0, 1) === "/") {
    filePath = path.resolve(filename);
  } else {
    filePath = path.resolve("node_modules", filename);
  }

  const extension = path.extname(filename);

  if (extension === ".rem") {
    return {
      node: ["parse", "(" + fs.readFileSync(filePath, "utf-8") + ")"],
      innerScope: {
        dirname: {
          map: () => ({
            node: ["_", path.dirname(filePath)],
          }),
          value: path.dirname(filePath),
        },
        filename: {
          map: () => ({
            node: ["_", filePath],
          }),
          value: filePath,
        },
      },
    };
  } else if (extension === ".js") {
    const newScope = require(filePath).default;
    return { node: ["_"], siblingScope: newScope };
  } else {
    throw `Unknown extension: ${filename}`;
  }
};