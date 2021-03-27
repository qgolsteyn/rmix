# Rmix: a tree manipulation library

Rmix is a small programming language used to manipulate tree structures.
Its primary goal is to enable developer to include logic in common document formats,
such as markdown and HTML.

Rmix is a Lisp. The rmix runtime consists of a tree of nodes, and a set of rules to map nodes into a different structure.
Rules are specified either in the rmix tree as `def` and `defn` statements or as Javascript rules specified when initializing
the interpreter.

For a demo of this language, visit https://rmix.golsteyn.com/

## Usage

```
(defn hello Hello world!)

(hello)
```

Will output:

```
(_ Hello world!)
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
