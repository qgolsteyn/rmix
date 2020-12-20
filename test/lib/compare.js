import _ from "lodash";

export default {
  ".compare": {
    post: ([result, expect]) => {
      return { node: ["_", _.isEqual(result, expect) ? "T" : "F"] };
    },
  },
};
