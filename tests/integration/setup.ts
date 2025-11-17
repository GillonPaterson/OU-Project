import { Logger } from "../../src/utils/Logger";

jest.mock("../../src/Clients/KontentAIClient", () => ({
	KontentAIClient: jest.fn(() => ({
		doesKontentSnippetExist: jest.fn(),
		kontentPageBuilder: jest.fn(),
		checkIfSnippetsExists: jest.fn(),
		createKontentSnippet: jest.fn(),
		buildSnippetElements: jest.fn(),
		buildPageElements: jest.fn(),
		buildElement: jest.fn(),
		buildCreateContentGroup: jest.fn(),
	})),
}));

jest.mock("../../src/Clients/PrismicClient", () => ({
	PrismicClient: jest.fn(() => ({
		fetchCustomTypes: jest.fn(),
	})),
}));

jest.mock("../../src/utils/Logger", () => ({
	Logger: jest.fn(() => ({
		writeJsonToLogs: jest.fn(),
		logSuccess: jest.fn(),
		logFail: jest.fn(),
	})),
}));
