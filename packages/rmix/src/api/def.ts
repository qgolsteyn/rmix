import { RmixNode } from "../types";

const def = {
  post: (mapping: (tail: RmixNode | undefined) => RmixNode) => ({
    post: (tail: RmixNode | undefined) => ({ node: mapping(tail) }),
  }),
  pre: (mapping: (tail: RmixNode | undefined) => RmixNode) => ({
    pre: (tail: RmixNode | undefined) => ({ node: mapping(tail) }),
  }),
};

export default def;
