export default {
  "+": {
    post: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc + item)],
    }),
  },
  "-": {
    post: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc - item)],
    }),
  },
  "*": {
    post: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc * item)],
    }),
  },
  "/": {
    post: (tail) => ({
      node: ["_", tail.reduce((acc, item) => acc / item)],
    }),
  },
};
