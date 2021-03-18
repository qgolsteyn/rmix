import { RmixNode } from "../types";

const def = {
  post: (mapping: (tail: RmixNode) => RmixNode) => ({
    post: (tail: RmixNode) => ({ node: mapping(tail) }),
  }),
  pre: (mapping: (tail: RmixNode) => RmixNode) => ({
    pre: (tail: RmixNode) => ({ node: mapping(tail) }),
  }),
};

export default def;
