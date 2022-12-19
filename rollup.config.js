import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "lib/cjs/index.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "lib/esm/index.mjs",
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({tsconfig: "./tsconfig.json"}),
            resolve(),
            commonjs(),
            json()

        ],
    },
    {
        input: "lib/esm/index.d.ts",
        output: [{file: "lib/index.d.ts", format: "esm"}],
        plugins: [dts()],
    },
];
