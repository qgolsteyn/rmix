import * as fs from "fs";

export const toFile = (node, path) => {
  if (typeof node === "object") {
    node = JSON.stringify(node, null, 2);
  }

  fs.writeFileSync(path, node);
};

export const toJson = (node) => {
  if (Array.isArray(node)) {
    if (node.length === 2 && !Array.isArray(node[1])) {
      return node[1];
    }

    let array = false;
    const keys = {};

    for (const item of node.slice(1)) {
      if (!Array.isArray(item)) {
        array = true;
        break;
      } else {
        if (keys[item[0]]) {
          array = true;
          break;
        } else {
          keys[item[0]] = true;
        }
      }
    }

    if (array) {
      return [
        ...node.slice(1).map((item) => {
          if (Array.isArray(item) && item[0] === "@") {
            return toJson(item);
          } else if (Array.isArray(item)) {
            return { [item[0]]: toJson(item) };
          } else {
            return toJson(item);
          }
        }),
      ];
    } else {
      const output = {};
      for (const item of node.slice(1)) {
        output[item[0]] = toJson(item);
      }

      return output;
    }
  } else {
    return node;
  }
};
