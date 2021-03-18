import { def, RmixDefinition, RmixNode } from "rmix";

const generateOutput = (node: RmixNode, indent = 0): string => {
  if (node.length === 0) {
    return "";
  }

  let complex = false;
  const outputItems = [];
  const isComplex: Record<number, boolean> = {};

  for (let i = 0; i < node.length; i++) {
    const item = node[i];
    if (Array.isArray(item)) {
      complex = true;
      isComplex[i] = true;
      outputItems.push(generateOutput(item, indent + 4));
    } else {
      isComplex[i] = false;
      outputItems.push(item);
    }
  }

  if (complex) {
    return (
      "".padStart(indent, " ") +
      "(" +
      outputItems
        .map((item, index) =>
          index > 0 && !isComplex[index]
            ? "".padStart(indent + 4, " ") + item
            : item
        )
        .join("\n") +
      ")"
    );
  } else {
    return "".padStart(indent, " ") + "(" + outputItems.join(" ") + ")";
  }
};

const stringify: Record<string, RmixDefinition> = {
  stringify: def.post((tail) => ["_", generateOutput(["_", ...tail])]),
};

export default stringify;
