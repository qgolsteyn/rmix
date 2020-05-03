export const createNode = (tag = undefined, children = [], args = {}) => ({
  ...args,
  tag,
  children,
});
