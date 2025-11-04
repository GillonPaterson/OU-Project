import { ManagementClient } from "@kontent-ai/management-sdk";

export const mockManagementClient = {
	addContentType: jest.fn(),
	modifyContentType: jest.fn(),
	listContentTypes: jest.fn(),
};

export const createMockKontentClient = () => {
	return mockManagementClient as unknown as ManagementClient;
};

export const mockKontentResponse = {
	data: {
		id: "test_type",
		name: "Test Type",
		codename: "test_type",
		elements: [
			{
				id: "test_element",
				type: "text",
				name: "Test Element",
				codename: "test_element",
			},
		],
	},
};
