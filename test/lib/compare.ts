import _ from "lodash";
import { RemixDefinition } from "../../src/types/Definition";

const compare: Record<string, RemixDefinition> = {
  ".compare": {
    post: ([result, expect]) => {
      return { node: ["_", _.isEqual(result, expect) ? "T" : "F"] };
    },
  },
};

export default compare;
