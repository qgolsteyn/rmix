import { def, namespace } from "../api";
import { createNode } from "../core/node";
import { RmixDefinition, RmixNode } from "../types";

const math: Record<string, RmixDefinition> = {
  "+": def.post((tail) => {
    let acc = tail?.value || 0;

    if (typeof acc !== "number") {
      throw new Error("Invariant violation: item of list must be a number");
    }

    let currentValue = tail?.next;

    while (currentValue) {
      const value = currentValue.value;
      if (typeof value !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }

      acc += value;

      currentValue = currentValue.next;
    }

    return createNode("_", createNode(acc));
  }),
  "-": def.post((tail) => {
    let acc = tail?.value || 0;

    if (typeof acc !== "number") {
      throw new Error("Invariant violation: item of list must be a number");
    }

    let currentValue = tail?.next;

    while (currentValue) {
      const value = currentValue.value;
      if (typeof value !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }

      acc -= value;

      currentValue = currentValue.next;
    }

    return createNode("_", createNode(acc));
  }),
  "*": def.post((tail) => {
    let acc = tail?.value || 0;

    if (typeof acc !== "number") {
      throw new Error("Invariant violation: item of list must be a number");
    }

    let currentValue = tail?.next;

    while (currentValue) {
      const value = currentValue.value;
      if (typeof value !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }

      acc *= value;

      currentValue = currentValue.next;
    }

    return createNode("_", createNode(acc));
  }),
  "/": def.post((tail) => {
    let acc = tail?.value || 0;

    if (typeof acc !== "number") {
      throw new Error("Invariant violation: item of list must be a number");
    }

    let currentValue = tail?.next;

    while (currentValue) {
      const value = currentValue.value;
      if (typeof value !== "number") {
        throw new Error("Invariant violation: item of list must be a number");
      }

      acc /= value;

      currentValue = currentValue.next;
    }

    return createNode("_", createNode(acc));
  }),
};

export default math;
