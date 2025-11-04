/** @type {import('jest').Config} */

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: [
		"**/tests/unit/**/*.test.ts", // unit tests
		"**/tests/integration/**/*.spec.ts", // integration tests
	],
	setupFilesAfterEnv: ["<rootDir>/tests/testhelpers/integrationTestSetup.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
	verbose: true,
};
