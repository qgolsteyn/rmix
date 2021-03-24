import { RmixNode } from "../types";

type RmixArray = Array<RmixArray | RmixNode | string | number>;

const isNode = (
  value: RmixArray | RmixNode | string | number
): value is RmixNode => typeof value === "object" && "value" in value;

export const createNode = (
  value: string | number | RmixNode,
  next?: RmixNode
) => ({
  value,
  next,
});

export const createNodeFromArray = (array: RmixArray): RmixNode => {
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
