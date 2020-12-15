export const map = [
  "def",
  "map",
  ["def", "item", ["head", ["#", "data"]]],
  [
    "?",
    [">", ["len", ["#", "data"]], 0],
    [
      "_",
      ["~", ["#", "to"]],
      ["map", ["to", ["#", "to"]], ["data", ["tail", ["#", "data"]]]],
    ],
  ],
];

export const filter = [
  "def",
  "filter",
  ["def", "item", ["head", ["#", "data"]]],
  [
    "?",
    [">", ["len", ["#", "data"]], 0],
    [
      "_",
      ["?", ["~", ["#", "condition"]], ["head", ["#", "data"]]],
      [
        "filter",
        ["data", ["tail", ["#", "data"]]],
        ["condition", ["#", "condition"]],
      ],
    ],
  ],
];
