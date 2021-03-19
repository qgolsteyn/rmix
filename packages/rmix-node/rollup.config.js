import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const input = "./src/index.ts";

const plugins = [
  typescript({ declaration: true, declarationDir: "dist/", rootDir: "src/" }),
  commonjs(),
];

export default [
  {
    external: ["lodash", "rmix", "process", "fs", "path"],
    input,
    output: {
      dir: "./dist",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    plugins,
  },
  {
    external: ["lodash", "rmix", "process", "fs", "path"],
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
