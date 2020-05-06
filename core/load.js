import * as fs from "fs";
import * as path from "path";

import { process } from "./process";

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

export const parse = (node, scope) =>
  process(["_", ...parser(tokenizer(parseRules))(node)], scope);

export const load = (node, scope) => {
  const extension = path.extname(node[1]);
  if (extension === ".rem") {
    return process(
      [
        "_",
        ...parser(tokenizer(parseRules))(
          "(" + fs.readFileSync(node[1], "utf-8") + ")"
        ),
      ],
      scope
    );
  } else if (extension === ".js") {
    const lib = require("../" + node[1]).default;
    for (const key of Object.keys(lib)) {
      scope[key] = lib[key];
    }
    return ["_"];
  } else {
    throw `Unknown extension: ${node[1]}`;
  }
};
