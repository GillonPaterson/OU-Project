import { migrateCustomTypes } from "../src/migrateCustomTypes.ts";
import fetch from "node-fetch";

jest.mock("node-fetch", () => jest.fn());

const { Response } = jest.requireActual("node-fetch");

describe("migrateCustomTypes", () => {
	const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

	beforeEach(() => {
		mockFetch.mockReset();
	});

	it("should fetch from source and POST to target", async () => {
		const fakeTypes = [
			{ id: "1", name: "Blog" },
			{ id: "2", name: "Product" },
		];

		// Mock the first GET request
		mockFetch
			.mockResolvedValueOnce(new Response(JSON.stringify(fakeTypes))) // GET /custom-types
			.mockResolvedValue(new Response("{}")); // POST calls

		await migrateCustomTypes();

		// Assert first fetch call
		expect(mockFetch).toHaveBeenCalledWith("https://cms-a.com/custom-types");

		// Assert POST calls
		expect(mockFetch).toHaveBeenCalledWith(
			"https://cms-b.com/custom-types",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify(fakeTypes[0]),
			})
		);
	});
});

