const def = ([tag, ...map], scope) => ({
  node: ["_"],
  siblingScope: {
    [tag]: {
      post: (tail) => ({
        node: ["_", ...map],
        innerScope: {
          ...scope,
          "#": {
            post: () => {
              return { node: ["'", ...tail] };
            },
          },
        },
      }),
    },
  },
});

export default {
  ".def": {
    post: def,
  },
  ".defn": {
    pre: def,
  },
  ".apply": {
    post: (tail) => ({ node: ["_", tail] }),
  },
};
