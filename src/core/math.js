export default {
  "+": {
    map: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc + item)],
    }),
  },
  "-": {
    map: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc - item)],
    }),
  },
  "*": {
    map: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc * item)],
    }),
  },
  "/": {
    map: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc / item)],
    }),
  },
};
