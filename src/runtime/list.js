export const map = [
  "def",
  "map",
  [
    "?",
    [">", ["len", ["#", "data"]], 0],
    [
      "_",
      ["apply", ["#", "to"], ["head", ["#", "data"]]],
      ["map", ["data", ["tail", ["#", "data"]]], ["to", ["#", "to"]]],
    ],
  ],
];

export const filter = [
  "def",
  "filter",
  [
    "?",
    [">", ["len", ["#", "data"]], 0],
    [
      "_",
      [
        "?",
        ["apply", ["#", "condition"], ["head", ["#", "data"]]],
        ["head", ["#", "data"]],
      ],
      [
        "filter",
        ["data", ["tail", ["#", "data"]]],
        ["condition", ["#", "condition"]],
      ],
    ],
  ],
];
