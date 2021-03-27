import { RmixNode, RmixArray } from "../types";

type RmixArrayExtended = Array<RmixArrayExtended | RmixNode | string | number>;

export const createNode = (
  value: string | number | RmixNode,
  next?: RmixNode
) => ({
  value,
  next,
});

export const createNodeFromArray = (array: RmixArrayExtended): RmixNode => {
  const headValue = array[0];

  if (typeof headValue !== "string") {
    throw new Error("Invariant violation: head must be a string");
  }

  let head = createNode(headValue);
  let tail: RmixNode = head;

  for (const value of array.slice(1)) {
    if (Array.isArray(value)) {
      tail.next = createNode(createNodeFromArray(value));
      tail = tail.next;
    } else {
      tail.next = createNode(value);
      tail = tail.next;
    }
  }

  return head;
};

export const createArrayFromNode = (node: RmixNode): RmixArray => {
  const output = [];

  let currentNode: RmixNode | undefined = node;

  while (currentNode) {
    const value = currentNode.value;

    if (typeof value === "object") {
      output.push(createArrayFromNode(value));
    } else {
      output.push(value);
    }

    currentNode = currentNode.next;
  }

  return output;
};

export const isNode = (node: RmixNode | string | number): node is RmixNode =>
  typeof node === "object" && "value" in node;
