module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        useESM: false,
      },
    ],
  },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.spec.ts",
    "!main.ts",
    "!**/*.module.ts",
    "!**/*.dto.ts",
    "!**/types.ts",
  ],
  coverageDirectory: "../coverage",
  transformIgnorePatterns: ["node_modules/"],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 80,
      lines: 80,
    },
  },
};
