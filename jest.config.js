const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  testTimeout: 30000,

  setupFiles: ["<rootDir>/tests/jest.setup.js"],

  setupFilesAfterEnv: ['<rootDir>/tests/setupAfterEnv.ts'],

  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: [
    "<rootDir>/src/**/**/*.{js,ts}"
  ],

  coverageDirectory: "<rootDir>/tests/coverage",

  coverageProvider: "v8",

  coverageReporters: ["text-summary", "lcov"],

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),

  modulePathIgnorePatterns: ["providers"],

  preset: "ts-jest",

  testEnvironment: "node",

  testMatch: ["**/?(*.)(spec|test).ts"],

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
    ],
  },
};
