import { createNode } from "../api/rmixNode";
import { Frame } from "./types";

export const createFrame = (
  frame: Omit<
    Frame,
    "processedChildren" | "currentProcessedChild" | "currentChild"
  >
): Frame => {
  const processChildren = createNode("_");
  (frame as Frame).currentChild = frame.node;
  (frame as Frame).processedChildren = processChildren;
  (frame as Frame).currentProcessedChild = processChildren;

  return frame as Frame;
};

export const getTagFromFrame = (tag: string, frame: Frame) => {
  let currentFrame = frame;

  while (currentFrame) {
    if (currentFrame.scope && currentFrame.scope[tag]) {
      return currentFrame.scope[tag];
    } else {
      currentFrame = currentFrame.parent;
    }
  }

  return undefined;
};
