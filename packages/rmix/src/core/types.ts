import { RmixDefinition, RmixNode } from "../types";

export enum STATUS {
  PRE_MAP_CHECK = "PRE_CHECK",
  VISIT_NODE_CHILDREN = "VISIT_NODE_CHILDREN",
  COMBINE_PROCESSED_CHILDREN = "COMBINE_PROCESSED_CHILDREN",
  POST_MAP_CHECK = "POST_CHECK",
  REPORT_TO_PARENT = "REPORT_TO_PARENT",
}

export interface Frame {
  status: STATUS;
  parent: Frame;
  node: RmixNode;
  currentChild?: RmixNode;
  scope?: Record<string, RmixDefinition>;
  currentProcessedChild: RmixNode;
  processedChildren: RmixNode;
}
