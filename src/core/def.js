const def = ([tag, ...map]) => ({
  node: ["_"],
  siblingScope: {
    [tag]: {
      post: (tail) => ({
        node: ["_", ...map],
        innerScope: {
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
  def: {
    post: def,
  },
  defn: {
    pre: def,
  },
  apply: {
    post: (tail) => ({ node: ["_", tail] }),
  },
};
