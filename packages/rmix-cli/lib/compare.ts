import _ from "lodash";
import { RmixDefinition } from "rmix";

const compare: Record<string, RmixDefinition> = {
  ".compare": {
    post: ([result, expect]) => {
      return { node: ["_", _.isEqual(result, expect) ? "T" : "F"] };
    },
  },
};

export default compare;
