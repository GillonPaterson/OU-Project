/** @type {import('jest').Config} */

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: [
		"**/tests/unit/**/*.test.ts",
		"**/tests/integration/**/*.test.ts",
	],
	setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
	verbose: true,
	
};

