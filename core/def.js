import { process } from "./process";

const checkMatch = (node, pattern, scope = {}) => {
  for (let i = 0; i < pattern.length; i++) {
    if (Array.isArray(pattern[i])) {
      if (!Array.isArray(node[i])) {
        return false;
      } else {
        const childScope = checkMatch(node[i], pattern[i], scope);
        if (childScope) {
          scope = { ...scope, ...childScope };
        } else {
          return false;
        }
      }
    } else if (String(pattern[i]).match(/_.*/)) {
      scope[`#${String(pattern[i]).match(/_(?<name>.*)/)[1]}`] = (_, scope) =>
        process(["_", node[i]], scope);
    } else if (node[i] !== pattern[i]) {
      return false;
    }
  }

  scope[`#${node[0]}`] = (_, scope) =>
    process(["_", ...node.slice(pattern.length)], scope);

  return scope;
};

const applyDefinition = (definitions) => (node, scope) => {
  for (const definition of definitions) {
    const argsScope = checkMatch(node, definition.pattern);
    if (argsScope) {
      const output = process(definition.output, { ...scope, ...argsScope });

      if (!definition.cached) {
        definitions.unshift({ pattern: node, output, cached: true });
      }

      return output;
    }
  }
};

export const def = (node, scope) => {
  const pattern = node[1];
  const head = pattern[0];

  const output = ["_", ...node.slice(2)];

  if (!scope[head]) {
    const definitions = [];
    scope[head] = applyDefinition(definitions);
    scope[head].definitions = definitions;
  }

  const definitions = [...scope[head].definitions];
  definitions.unshift({ pattern, output });

  scope[head] = applyDefinition(definitions);
  scope[head].definitions = definitions;

  return ["_"];
};
