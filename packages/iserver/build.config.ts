import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/index",
    "src/geometry",
    "src/utils",
    "src/sm",
    "src/services",
    "src/services/data",
    "src/services/map",
    "src/services/network",
  ],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
  },
  failOnWarn: true,
})
