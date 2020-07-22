// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  globalSetup: './test/00-setup.js',
  globalTeardown: './test/00-teardown.js',
  setupFilesAfterEnv: ['./test/00-env.js'],
  testMatch: ['<rootDir>/test/*.js'],
  testPathIgnorePatterns: ['/test/00-.*\\.js'],
};
