import typescript from "@rollup/plugin-typescript";
import { generateDtsBundle } from "rollup-plugin-dts-bundle-generator";
export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm"
    },
    plugins: [
      typescript(),
      generateDtsBundle({
        entry: [{ filePath: "src/index.ts" }]
      })
    ]
  }
];
