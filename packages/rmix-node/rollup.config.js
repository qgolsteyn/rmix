import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const input = "./src/index.ts";

const plugins = [typescript(), commonjs()];

export default [
  {
    external: ["lodash"],
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    plugins,
  },
  {
    external: ["lodash"],
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins,
  },
];
