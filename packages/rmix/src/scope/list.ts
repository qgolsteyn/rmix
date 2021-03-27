import { def, namespace, rmixNode } from "../api";
import { RmixDefinition, RmixNode } from "../types";

const list: Record<string, RmixDefinition> = namespace("list", {
  head: def.post((node) =>
    rmixNode.createNode("_", node && rmixNode.createNode(node?.value))
  ),
  tail: def.post((node) => rmixNode.createNode("_", node?.next)),
  len: def.post((node) => {
    let currentNode = node;
    let length = 0;

    while (currentNode) {
      length += 1;
      currentNode = currentNode.next;
    }

    return rmixNode.createNode("_", rmixNode.createNode(length));
  }),
  get: def.post((node) => {
    const index = node?.value;
    if (typeof index !== "number") {
      throw new Error("Invariant violation: index must be an integer");
    }

    let currentNode = node?.next;
    let currentIndex = 0;
    while (currentNode && currentIndex < index) {
      currentNode = currentNode.next;
      currentIndex += 1;
    }

    return rmixNode.createNode(
      "_",
      currentNode?.value !== undefined
        ? rmixNode.createNode(currentNode.value)
        : undefined
    );
  }),
  range: def.post((node) => {
    const end = node?.value;
    if (typeof end !== "number") {
      throw new Error("Invariant violation: end must be an integer");
    }

    const head = rmixNode.createNode("_");
    let tail: RmixNode = head;

    for (let i = 0; i < end; i++) {
      tail.next = rmixNode.createNode(i);
      tail = tail.next;
    }

    return head;
  }),
  map: def.post((node) => {
    const tag = node?.value;
    if (typeof tag !== "string") {
      throw new Error("Invariant violation: tag must be a string");
    }

    const head = rmixNode.createNode("_");
    let tail: RmixNode = head;

    let currentNode = node?.next;

    while (currentNode) {
      tail.next = rmixNode.createNode(
        rmixNode.createNode(tag, rmixNode.createNode(currentNode.value))
      );

      tail = tail.next;
      currentNode = currentNode.next;
    }

    return head;
  }),
});

export default list;
