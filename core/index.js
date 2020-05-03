import * as fs from "fs";
import * as path from "path";

import { createNode } from "./createNode";

const parseRules = [
  { type: "space", regex: /^\s/ },
  { type: "lParen", regex: /^\(/ },
  { type: "rParen", regex: /^\)/ },
  { type: "number", regex: /^[0-9\.]+/ },
  { type: "string", regex: /^".*?"/ },
  { type: "variable", regex: /^[^\s\(\)]+/ },
];

const tokenizer = (rules) => (input) => {
  for (let i = 0; i < rules.length; i += 1) {
    let tokenized = rules[i].regex.exec(input);
    if (tokenized) {
      return {
        token: tokenized[0],
        type: rules[i].type,
        rest: input.slice(tokenized[0].length),
      };
    }
  }

  throw new Error(`no matching tokenize rule for ${JSON.stringify(input)}`);
};

const parser = (tokenize) =>
  function parse(input, ast, parents = []) {
    if (input === "") {
      return ast;
    }

    const { token, type, rest } = tokenize(input);

    if (type === "space") {
      // do nothing
      return parse(rest, ast, parents);
    } else if (type === "variable") {
      ast.push(token);
      return parse(rest, ast, parents);
    } else if (type === "number") {
      ast.push(Number(token));
      return parse(rest, ast, parents);
    } else if (type === "string") {
      ast.push(token.replace(/(^"|"$)/g, "").replace(/\\n/g, "\n"));
      return parse(rest, ast, parents);
    } else if (type === "lParen") {
      parents.push(ast);
      return parse(rest, [], parents);
    } else if (type === "rParen") {
      const parentAst = parents.pop();
      if (parentAst) {
        parentAst.push(ast);
        return parse(rest, parentAst, parents);
      }

      return parse(rest, ast, parents);
    }

    throw new Error(`Missing parse logic for rule ${JSON.stringify(type)}`);
  };

const parse = (scope) =>
  createNode(
    undefined,
    parser(tokenizer(parseRules))(scope.children[0]),
    scope
  );

const load = (scope, parent) => {
  const extension = path.extname(scope.children[0]);
  if (extension === ".rem") {
    return evalChildren(
      createNode(
        undefined,
        parser(tokenizer(parseRules))(
          "(" + fs.readFileSync(scope.children[0], "utf-8") + ")"
        ),
        parent
      )
    );
  } else if (extension === ".js") {
    const lib = require("../" + scope.children[0]).default;
    for (const key of Object.keys(lib)) {
      parent[key] = lib[key];
    }
    return createNode();
  } else {
    throw "Unknown extension";
  }
};

const baseScope = {
  def: (scope, parent) => {
    parent[scope.children[0]] = (scopeChild) =>
      evalChildren(
        createNode(undefined, scope.children.slice(1), {
          ...scopeChild,
          "#": (scopeArg) =>
            evalChildren(createNode(undefined, scopeChild.children, scopeArg)),
        })
      );
    return createNode(undefined, [], scope);
  },
  "#": () => createNode(),
  "@": (scope) => createNode(undefined, scope.children, scope),
  _: (scope) => createNode(undefined, scope.children, scope),
  parse,
  load,
};

const evalChildren = (scope) => {
  if (scope.children.length > 0) {
    const newChildren = [];
    for (const child of scope.children) {
      if (Array.isArray(child)) {
        newChildren.push(...evalNode(child, scope));
      } else {
        newChildren.push(child);
      }
    }
    return { ...scope, children: newChildren };
  } else {
    return scope;
  }
};

const evalNode = (node, parent = baseScope) => {
  let scope = {
    ...parent,
    tag: node[0],
    children: node.slice(1),
  };

  if (scope.tag !== "@") {
    scope = evalChildren(scope);
  }

  while (scope[scope.tag]) {
    scope = { ...scope, ...scope[scope.tag](scope, parent) };
  }

  if (scope.tag === undefined) {
    for (const key of Object.keys(scope).filter(
      (item) => item !== "tag" && item !== "children"
    )) {
      parent[key] = scope[key];
    }

    return scope.children;
  } else {
    return [[scope.tag, ...scope.children]];
  }
};

export const process = (scope, parent = {}) =>
  createNode(
    undefined,
    evalNode(scope.children, {
      ...parent,
      ...scope,
      ...baseScope,
      process,
    })
  );
