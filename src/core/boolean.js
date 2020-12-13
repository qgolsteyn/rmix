export default {
  and: {
    map: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc && item === "T", true) ? "T" : "F",
      ],
    }),
  },
  or: {
    map: (tail) => ({
      node: [
        "_",
        tail.reduce((acc, item) => acc || item === "T", false) ? "T" : "F",
      ],
    }),
  },
};
