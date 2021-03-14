import compare from "./compare";
import importRemix from "./import";
import parse from "./parse";
import stringify from "./stringify";

export default {
  node: {
    namespace: {
      ...importRemix,
      ...parse,
      ...stringify,
      ...compare,
    },
  },
};
