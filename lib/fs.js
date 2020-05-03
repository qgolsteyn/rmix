import * as fs from "fs";

import { createNode } from "../core/createNode";

export default {
  write: (scope) => {
    fs.writeFileSync(scope.children[0], scope.children[1]);
    return createNode(undefined, scope.children.slice(1), scope);
  },
};
