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

  return scope;
};

function applyDefinition(node, scope) {
  for (const definition of this) {
    const argsScope = checkMatch(node, definition.pattern);
    if (argsScope) {
      const output = process(definition.output, { ...scope, ...argsScope });

      if (!definition.cached) {
        this.unshift({ pattern: node, output, cached: true });
      }

      return output;
    }
  }
}

export const def = (node, scope) => {
  const pattern = node[1];
  const head = pattern[0];

  const output = ["_", ...node.slice(2)];

  if (!scope[head]) {
    const definitions = [];
    scope[head] = applyDefinition.bind(definitions);
    scope[head].definitions = definitions;
  }

  const definitions = scope[head].definitions;
  definitions.unshift({ pattern, output });

  return ["_"];
};
