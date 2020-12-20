import { RmixDefinition, RmixNode } from "rmix";

const PARSE_RULES = [
  { type: "space", regex: /^\s/ },
  { type: "lParen", regex: /^\(/ },
  { type: "rParen", regex: /^\)/ },
  { type: "string", regex: /^".*?"/ },
  { type: "number", regex: /^[0-9]+(\.[0-9]*)?/ },
  { type: "alpha", regex: /^[^\s\(\)]+/ },
];

const tokenizer = (input: string) => {
  for (let i = 0; i < PARSE_RULES.length; i += 1) {
    const tokenized = PARSE_RULES[i].regex.exec(input);
    if (tokenized) {
      return {
        token: tokenized[0],
        type: PARSE_RULES[i].type,
        rest: input.slice(tokenized[0].length),
      };
    }
  }

  throw new Error(`no matching tokenize rule for ${JSON.stringify(input)}`);
};

const parser = (
  input: string,
  ast: Array<string | number> = [],
  parents: Array<Array<string | number>> = []
): RmixNode => {
  if (input === "") {
    return ast;
  }

  const result = tokenizer(input);
  const { token, type } = result;
  let { rest } = result;

  if (type === "space") {
    // do nothing
    return parser(rest, ast, parents);
  } else if (type === "string") {
    ast.push(token.replace(/(^"|"$)/g, ""));
    return parser(rest, ast, parents);
  } else if (type === "alpha" || type === "specialChar") {
    ast.push(token);
    return parser(rest, ast, parents);
  } else if (type === "number") {
    ast.push(Number(token));
    return parser(rest, ast, parents);
  } else if (type === "lParen") {
    parents.push(ast);

    const match = rest.match(/^[^\s\(\)]+/);

    if (match) {
      rest = `"${match[0]}" ${rest.slice(match[0].length)}`;
    }

    return parser(rest, [], parents);
  } else if (type === "rParen") {
    const parentAst = parents.pop();
    if (parentAst) {
      parentAst.push(ast as any);
      return parser(rest, parentAst, parents);
    }

    return parser(rest, ast, parents);
  }

  throw new Error(`Missing parse logic for rule ${JSON.stringify(type)}`);
};

const parse: Record<string, RmixDefinition> = {
  ".parse": {
    post: ([content]) => {
      if (typeof content !== "string") {
        throw new Error(
          `Invariant violation: input to parse must be a string. Received ${typeof content}`
        );
      }

      const result = parser(content);

      return {
        node: ["~", ...result],
      };
    },
  },
};

export default parse;
