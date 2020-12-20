const def = (type) => ([tag, ...map], scope) => ({
  node: ["_"],
  siblingScope: {
    [tag]: {
      ...scope[tag],
      [type]: (tail) => ({
        node: ["_", ...map],
        innerScope: {
          ...scope,
          "#": {
            post: () => {
              return { node: ["'", ...tail] };
            },
          },
          "#!": {
            post: () => {
              return { node: ["_", ...tail] };
            },
          },
        },
      }),
    },
  },
});

export default {
  ".def": {
    post: def("post"),
  },
  ".defn": {
    pre: def("post"),
  },
  ".predef": {
    post: def("pre"),
  },
  ".predefn": {
    pre: def("pre"),
  },
  ".apply": {
    post: (tail) => ({ node: ["_", tail] }),
  },
};
