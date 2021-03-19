import * as proc from "process";
import * as fs from "fs";
import * as path from "path";
import { RmixDefinition } from "rmix";

const importRemix: Record<string, RmixDefinition> = {
  import: {
    post: ([filename], scope) => {
      if (typeof filename !== "string") {
        throw new Error("Invariant violation: filename must be a string");
      }

      const dirname =
        scope.dirname && scope.dirname.post
          ? (scope.dirname.post([], {}).node[1] as string)
          : (proc.cwd() as string);

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
          node: ["rmix.parse", fs.readFileSync(filePath, "utf-8")],
          innerScope: {
            dirname: {
              post: () => ({
                node: ["_", path.dirname(filePath)],
              }),
            },
            filename: {
              post: () => ({
                node: ["_", filePath],
              }),
            },
          },
        };
      } else if (extension === ".js") {
        const newScope = require(filePath).default;
        return { node: ["_"], siblingScope: newScope };
      } else {
        throw `Unknown extension: ${filename}`;
      }
    },
  },
};

export default importRemix;
