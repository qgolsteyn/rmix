import _ from "lodash";
import { def, RmixDefinition } from "rmix";

const compare: Record<string, RmixDefinition> = {
  compare: def.post(([result, expect]) => [
    "_",
    _.isEqual(result, expect) ? "T" : "F",
  ]),
};

export default compare;
