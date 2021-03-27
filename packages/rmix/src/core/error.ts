import { Frame } from "./types";

export enum ERROR_TYPES {
  USER = "Error while processing tag",
  INVARIANT = "Invariant Violation",
  INTERNAL = "Internal Error",
}

export const createErrorMessage = (
  type: ERROR_TYPES,
  message: string,
  frame?: Frame
) => `${type}:
${message}

Stack call:
${frame ? generateStackCall(frame) : "The frame was undefined."}`;

const generateStackCall = (frame: Frame) => {
  const tags = [];
  let currentFrame = frame;

  while (currentFrame) {
    tags.push(currentFrame.node.value);
    currentFrame = currentFrame.parent;
  }

  return '"' + tags.join('"\nin "');
};
