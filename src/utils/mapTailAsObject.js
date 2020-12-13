export const mapTailAsObject = (tail) => {
  const obj = {};

  for (const child of tail) {
    if (Array.isArray(child)) {
      obj[child[0]] = child.slice(1);
    }
  }

  return obj;
};
