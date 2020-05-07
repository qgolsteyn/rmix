const toJson = (node) => {
  if (Array.isArray(node)) {
    if (node.length === 2) {
      return node[1];
    }

    let array = false;

    for (const item of node.slice(1)) {
      if (!Array.isArray(item)) {
        array = true;
      }
    }

    if (array) {
      return [
        ...node.slice(1).map((item) => {
          if (Array.isArray(item)) {
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

const jsonVisitor = (node) => {
  if (Array.isArray(node)) {
    return node.map((item) => jsonVisitor(item));
  } else if (typeof node === "object") {
    return Object.entries(node).map((item) => [
      item[0],
      ...jsonVisitor(item[1]),
    ]);
  } else {
    return [node];
  }
};

console.log(
  JSON.stringify(
    toJson([
      "_",
      ["title", "this is cool"],
      ["author", ["firstName", "Quentin"], ["lastName", "Golsteyn"]],
      ["content", "wow"],
    ]),
    null,
    2
  )
);

console.log(
  JSON.stringify(
    toJson([
      "_",
      ...jsonVisitor(
        toJson([
          "_",
          ["title", "this is cool"],
          ["author", ["firstName", "Quentin"], ["lastName", "Golsteyn"]],
          ["content", "wow"],
        ])
      ),
    ]),
    null,
    2
  )
);
