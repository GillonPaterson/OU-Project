import dotenv from "dotenv";
import path from "path";
import axios from "axios";

// Mock the entire SDK
jest.mock("@kontent-ai/management-sdk", () => ({
	ManagementClient: jest.fn().mockImplementation(() => ({
		addContentType: jest.fn(),
		modifyContentType: jest.fn(),
		listContentTypes: jest.fn(),
	})),
}));

// Mock axios for Prismic calls
jest.mock("axios");

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });
jest.setTimeout(30000);
