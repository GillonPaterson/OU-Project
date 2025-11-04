/** @type {import('jest').Config} */

module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: [
		"**/tests/unit/**/*.test.ts", // unit tests
	],
	moduleFileExtensions: ["ts", "js", "json"],
	clearMocks: true,
	verbose: true,
};
