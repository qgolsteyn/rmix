const parseRules = [
  { type: "space", regex: /^\s/ },
  { type: "lParen", regex: /^\(/ },
  { type: "rParen", regex: /^\)/ },
  { type: "string", regex: /^".*?"/ },
  { type: "number", regex: /^[0-9]+(\.[0-9]*)?/ },
  { type: "alpha", regex: /^[^\s\(\)]+/ },
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

    let { token, type, rest } = tokenize(input);

    if (type === "space") {
      // do nothing
      return parse(rest, ast, parents);
    } else if (type === "string") {
      ast.push(token.replace(/(^"|"$)/g, ""));
      return parse(rest, ast, parents);
    } else if (type === "alpha" || type === "specialChar") {
      ast.push(token);
      return parse(rest, ast, parents);
    } else if (type === "number") {
      ast.push(Number(token));
      return parse(rest, ast, parents);
    } else if (type === "lParen") {
      parents.push(ast);

      const match = rest.match(/^[^\s\(\)]+/);

      if (match) {
        rest = `"${match[0]}" ${rest.slice(match[0].length)}`;
      }

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

export default {
  ".parse": {
    post: ([content]) => ({
      node: ["~", ...parser(tokenizer(parseRules))(content)],
    }),
  },
};
