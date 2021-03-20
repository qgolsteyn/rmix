import * as React from "react";
import rmix from "rmix";
import rmixToReact from "../utils/renderHTML";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-lisp";

import "./style.css";

const code = `(html.h1 Welcome to rmix!)

(html.p This document is a small example to the rmix language
  and interpreter. Rmix is a Lisp based on the concept of node
  replacement.)
  
(html.p The rmix runtime consists of a tree of nodes and a set
  of replacement rules. If a tag matches a rule, the content of
  the node is replaced according the rule matched. Some rules are dynamic
  and will execute some Javascript code. This is the case of (html.code list.range)
  for example, which will be replaced by an incrementing list of numbers with the
  length given by the first argument. Like so: (list.range 10).)
  
(html.h2 Some examples)

(html.p Press on the hide HTML button to see the underlying
  rmix code powering this document.)

(html.h3 Some math operations)

(html.p The answer to 2 + 2 * 10 = (html.b (+ 2 (* 2 10))))

(html.h3 Creating a list of elements)

(; Defining a rule to generate an unordered HTML list)
(defn uList (html.ul (list.map html.li (#))))

(uList (list.range 10))

(html.h3 Listing the fibonacci numbers with recursion)

(; Defining a rule to generate the fibonacci suite)
(defn fib
  (def max (#))
  
  (defn fib.inner
    (def count (list.get 0 (#)))
    (def first (list.get 1 (#)))
    (def second (list.get 2 (#)))
    
    (def third (+ (first) (second)))
    (third)
    
    (? (< (count) (max))
      (fib.inner (++ (count)) (second) (third))))
  
  1 1 (fib.inner 2 1 1))
  
(html.p The fibonacci suite up to 10: (fib 10))`;

// markup
const IndexPage = () => {
  const [value, setValue] = React.useState(code);
  const [compiledValue, setCompiledValue] = React.useState(["_", "press run"]);
  const [showHTML, setShowHTML] = React.useState(true);

  return (
    <main className="sandbox">
      <div className="sandbox__controls">
        <button
          onClick={() => setCompiledValue(rmix(["_", ["rmix.parse", value]]))}
        >
          <span class="material-icons">play_circle</span>run
        </button>
        <button onClick={() => setShowHTML(!showHTML)}>
          {showHTML ? (
            <>
              <span class="material-icons">code</span>show code
            </>
          ) : (
            <>
              <span class="material-icons">code_off</span>hide code
            </>
          )}
        </button>
      </div>
      <div className="sandbox__code-editor">
        <Editor
          value={value}
          onValueChange={setValue}
          padding={16}
          highlight={(code) => highlight(code, languages.lisp)}
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
          }}
        />
      </div>
      <div className="sandbox__result-box">
        {showHTML ? (
          rmixToReact(compiledValue)
        ) : (
          <pre>{rmix(["_", ["rmix.stringify", compiledValue]])[1]}</pre>
        )}
      </div>
    </main>
  );
};

export default IndexPage;
