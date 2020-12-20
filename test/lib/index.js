import compare from "./compare";
import importRemix from "./import";
import parse from "./parse";

export default {
  ...importRemix,
  ...parse,
  ...compare,
};
