import { def, namespace, rmixNode } from "../api";
import { RmixDefinition } from "../types";

const conditional: Record<string, RmixDefinition> = {
  "?": def.pre((node) => {
    if (node === undefined) {
      throw new Error("Invariant violation: must specify a condition");
    }

    const truthy = node.next && node.next.value;
    const falsy = node.next?.next && node.next?.next.value;

    if (falsy) {
      return rmixNode.createNodeFromArray([
        "?.inner",
        node.value,
        ["?.truthy", ["'", truthy!]],
        ["?.falsy", ["'", falsy]],
      ]);
    } else if (truthy) {
      return rmixNode.createNodeFromArray([
        "?.inner",
        node.value,
        ["?.truthy", ["'", truthy]],
      ]);
    } else {
      return rmixNode.createNode("_");
    }
  }),
  ...namespace("?", {
    inner: def.post((node) => {
      const cond = node?.value;

      const truthyValue = node?.next?.value;
      const falsyValue = node?.next?.next?.value;

      if (cond === "T") {
        if (
          truthyValue &&
          typeof truthyValue === "object" &&
          truthyValue.next
        ) {
          return rmixNode.createNode(
            "_",
            rmixNode.createNode(truthyValue.next.value)
          );
        } else {
          return rmixNode.createNode("_");
        }
      } else if (cond === "F") {
        if (falsyValue && typeof falsyValue === "object" && falsyValue.next) {
          return rmixNode.createNode(
            "_",
            rmixNode.createNode(falsyValue.next.value)
          );
        } else {
          return rmixNode.createNode("_");
        }
      } else {
        throw new Error("Invariant violation: cond must be a boolean.");
      }
    }),
  }),
  "==": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left === right ? "T" : "F")
    );
  }),
  "!=": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left !== right ? "T" : "F")
    );
  }),
  ">=": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error(
        "Invariant violation: both side of inequality must be a number"
      );
    }

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left >= right ? "T" : "F")
    );
  }),
  "<=": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error(
        "Invariant violation: both side of inequality must be a number"
      );
    }

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left <= right ? "T" : "F")
    );
  }),
  ">": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error(
        "Invariant violation: both side of inequality must be a number"
      );
    }

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left > right ? "T" : "F")
    );
  }),
  "<": def.post((node) => {
    const left = node?.value;
    const right = node?.next?.value;

    if (typeof left !== "number" || typeof right !== "number") {
      throw new Error(
        "Invariant violation: both side of inequality must be a number"
      );
    }

    return rmixNode.createNode(
      "_",
      rmixNode.createNode(left < right ? "T" : "F")
    );
  }),
};

export default conditional;
