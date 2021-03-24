import { def, namespace } from "../api";
import { createNode } from "../core/node";
import { RmixDefinition, RmixNode } from "../types";

const list: Record<string, RmixDefinition> = namespace("list", {
  head: def.post((node) => createNode("_", node && createNode(node?.value))),
  tail: def.post((node) => createNode("_", node?.next)),
  len: def.post((node) => {
    let currentNode = node;
    let length = 0;

    while (currentNode) {
      length += 1;
      currentNode = currentNode.next;
    }

    return createNode("_", createNode(length));
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

    return createNode(
      "_",
      currentNode?.value !== undefined
        ? createNode(currentNode.value)
        : undefined
    );
  }),
  range: def.post((node) => {
    const end = node?.value;
    if (typeof end !== "number") {
      throw new Error("Invariant violation: end must be an integer");
    }

    const head = createNode("_");
    let tail: RmixNode = head;

    for (let i = 0; i < end; i++) {
      tail.next = createNode(i);
      tail = tail.next;
    }

    return head;
  }),
  map: def.post((node) => {
    const tag = node?.value;
    if (typeof tag !== "string") {
      throw new Error("Invariant violation: tag must be a string");
    }

    const head = createNode("_");
    let tail: RmixNode = head;

    let currentNode = node?.next;

    while (currentNode) {
      tail.next = createNode(createNode(tag, createNode(currentNode.value)));

      tail = tail.next;
      currentNode = currentNode.next;
    }

    return head;
  }),
});

export default list;
