import { def, namespace } from "../api";
import { createNode } from "../core/node";
import { RmixDefinition, RmixNode } from "../types";

const generateOutput = (node: RmixNode | undefined, indent = 0): string => {
  if (!node) {
    return "";
  }

  let complex = false;
  const outputItems = [];
  const isComplex: Record<number, boolean> = {};

  let i = 0;
  let currentNode: RmixNode | undefined = node;
  while (currentNode) {
    const item = currentNode.value;
    if (typeof item === "object") {
      complex = true;
      isComplex[i] = true;
      outputItems.push(generateOutput(item, indent + 4));
    } else {
      isComplex[i] = false;
      outputItems.push(item);
    }

    i += 1;
    currentNode = currentNode.next;
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

const stringify: Record<string, RmixDefinition> = namespace("rmix", {
  stringify: def.post((tail) =>
    createNode("_", createNode(generateOutput(createNode("_", tail))))
  ),
});

export default stringify;
