import compare from "./compare";
import importRemix from "./import";
import parse from "./parse";

export default {
  node: {
    namespace: {
      ...importRemix,
      ...parse,
      ...compare,
    },
  },
};
