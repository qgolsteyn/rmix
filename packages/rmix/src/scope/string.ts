import { def, namespace } from "../api";
import {
  createArrayFromNode,
  createNode,
  createNodeFromArray,
} from "../api/rmixNode";
import { RmixDefinition } from "../types";

const string: Record<string, RmixDefinition> = namespace("string", {
  charAt: def.post((node) => {
    const index = node?.value;
    const value = node?.next?.value;

    if (typeof index !== "number") {
      throw new Error("Invariant violation: index must be a number");
    }

    if (typeof value === "object") {
      throw new Error(
        "Invariant violation: value must be a string or a number"
      );
    }

    return createNode("_", createNode(String(value).charAt(index)));
  }),
  concat: def.post((node) => {
    let output = "";

    let currentNode = node;
    while (currentNode) {
      const { value } = currentNode;

      if (typeof value === "object") {
        throw new Error(
          "Invariant violation: value must be a string or a number"
        );
      }

      output += String(value);

      currentNode = currentNode.next;
    }

    return createNode("_", createNode(output));
  }),
  split: def.post((node) => {
    const delimiter = node?.value;
    const value = node?.next?.value;

    if (typeof delimiter === "object") {
      throw new Error(
        "Invariant violation: index must be a string or a number"
      );
    }

    if (typeof value === "object") {
      throw new Error(
        "Invariant violation: value must be a string or a number"
      );
    }

    return createNodeFromArray([
      "_",
      ...String(value).split(String(delimiter)),
    ]);
  }),
  join: def.post((node) => {
    const delimiter = node?.value;
    const valueNode = node?.next;

    if (typeof delimiter === "object") {
      throw new Error(
        "Invariant violation: index must be a string or a number"
      );
    }

    return createNode(
      "_",
      createNode(
        createArrayFromNode(valueNode || createNode("")).join(String(delimiter))
      )
    );
  }),
});

export default string;
