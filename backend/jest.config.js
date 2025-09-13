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
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  transformIgnorePatterns: ["node_modules/"],
};
