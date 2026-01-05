const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if any)
    '^@/(.*)$': '<rootDir>/$1',
    // More aliases can be added here
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // Add more setup options before each test is run
  // setupFiles: ['<rootDir>/jest.setup.js'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig({
  setupFilesAfterEnv: customJestConfig.setupFilesAfterEnv,
  testEnvironment: customJestConfig.testEnvironment,
  moduleNameMapper: customJestConfig.moduleNameMapper,
  moduleDirectories: customJestConfig.moduleDirectories,
  // Add more setup options before each test is run
  // setupFiles: customJestConfig.setupFiles, // Uncomment if you use it
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
});