module.exports = {
  name: 'ddk-ddc',
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  testMatch: ['**/*.test.ts'],
  // Fixes slow calls to Math function from node VM that is used by Jest (see: https://github.com/facebook/jest/issues/5163#issuecomment-457925591)
  extraGlobals: ['Math'],
};
