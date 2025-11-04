import axios from "axios";
import { ManagementClient } from "@kontent-ai/management-sdk";
import { fetchCustomTypes } from "../../src/migrateCustomTypes";
import { kontentPageBuilder } from "../../src/KontentAI/kontentAIPageBuilder";
import { mockPrismicCustomTypes } from "../testHelpers/mocks/prismicMocks";
import {
	createMockKontentClient,
	mockKontentResponse,
} from "../testHelpers/mocks/kontentMocks";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockKontentClient = createMockKontentClient();

describe("Custom Types Migration Integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Setup Prismic mock
		mockedAxios.get.mockResolvedValue({ data: mockPrismicCustomTypes });
		// Setup Kontent.ai mock
		(mockKontentClient.addContentType as jest.Mock).mockResolvedValue(
			mockKontentResponse
		);
	});

	it("should fetch custom types from Prismic", async () => {
		const result = await fetchCustomTypes();

		expect(mockedAxios.get).toHaveBeenCalledWith(
			expect.stringContaining("prismic"),
			expect.any(Object)
		);
		expect(result).toEqual(mockPrismicCustomTypes);
	});

	it("should create pages in Kontent.ai", async () => {
		const kontentPage = {
			pageName: "Test Page",
			codename: "test_page",
			pageTabs: [],
		};

		const result = await kontentPageBuilder(kontentPage, mockKontentClient);

		expect(mockKontentClient.addContentType).toHaveBeenCalledWith({
			name: kontentPage.pageName,
			codename: kontentPage.codename,
			elements: expect.any(Array),
		});
		expect(result).toEqual(mockKontentResponse.data);
	});

	it("should handle Kontent.ai SDK errors gracefully", async () => {
		(mockKontentClient.addContentType as jest.Mock).mockRejectedValueOnce(
			new Error("SDK Error")
		);

		const kontentPage = {
			pageName: "Test Page",
			codename: "test_page",
			pageTabs: [],
		};

		await expect(
			kontentPageBuilder(kontentPage, mockKontentClient)
		).rejects.toThrow("SDK Error");
	});
});
