const head = (node) => node[0];
const tail = (node) => node.slice(1);

const getArgs = (node) => (childNode, childScope) => {
  if (childNode[1]) {
    return process(
      ["_", tail(node).find((item) => item[0] === childNode[1])],
      childScope
    );
  } else {
    return process(["_", ...tail(node)], childScope);
  }
};

const createNewDef = (child, scope) => {
  if (Array.isArray(child[1])) {
    const pattern = child[1];

    const prevCall = scope[pattern[0]];

    scope[pattern[0]] = (node, scope) => {
      const newScope = { ...scope };

      let valid = true;
      let wildcardCounter = 0;
      for (let i = 0; i < tail(pattern).length; i++) {
        const patternElem = tail(pattern)[i];
        const nodeElem = tail(node)[i];

        if (patternElem === "_" && nodeElem !== undefined) {
          newScope[`#${wildcardCounter}`] = getArgs(["_", nodeElem]);
          wildcardCounter += 1;
        } else if (patternElem !== nodeElem) {
          valid = false;
          break;
        }
      }

      if (valid) {
        return process(["_", ...child.slice(2)], {
          ...newScope,
          "#": getArgs(node.slice(pattern.length)),
        });
      } else if (prevCall) {
        return prevCall(node, scope);
      } else {
        return undefined;
      }
    };
  } else {
    scope[child[1]] = (node, scope) =>
      process(["_", ...child.slice(2)], {
        ...scope,
        "#": getArgs(node),
      });
  }
};

export const process = (node, scope = {}) => {
  let children = [];

  for (let child of tail(node)) {
    if (Array.isArray(child) && child[0] === "def") {
      createNewDef(child, scope);
    } else if (Array.isArray(child)) {
      child = process(child, scope);

      if (child[0] === "_") {
        children.push(...tail(child));
      } else {
        children.push(child);
      }
    } else if (child !== null && child !== undefined) {
      children.push(child);
    }
  }

  node = [head(node), ...children];

  if (scope[head(node)]) {
    const newNode = scope[head(node)](node, scope);
    node = newNode !== undefined ? newNode : node;
  }

  return node;
};
