types:

- numbers
- symbols
- pattern

primitive op:

- `_` acts as a no-op
- `=` assigns an equivalence between LHS and RHS

Visit tree in post-order and modify tree as needed. If a modification is performed, revisit subtree post order.

Matching:

Inspired from regex.

Matching is performed on the tag first, then it is further restricted using the children. Replacement is made from LHS to RHS only. Loss of information
is permitted. Children matching can be order dependent or independent.

`(= (\h(^ num [1-6])\ ___) (* # ^num) ___)`
`(= x 2)`
`(= \\\n\ "\n")`
`(= (? T _ _) _0)`
`(= (? F _ _) _1)`
`(= (? F (_) (_)) _1)`
`(= (markdown ___) (body (article (h1 _title))))`
`(= (markdown (title)) _title)`

`(= (h[order_{1-6}] ___) (* "#" (order)) ___)`

`(= (+ ___ _[#] ___) (+ a___ b___))`

`(= (+ ___ [#] ___))`

`(= (+ ___ [(1-9)+]))`
