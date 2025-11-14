import {
	createManagementClient,
	ManagementClient,
} from "@kontent-ai/management-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const KONTENT_PROJECT_ID = process.env.KONTENT_PROJECT_ID;
const KONTENTAI_KEY = process.env.KONTENTAI_KEY;


export function createKontentClient(): ManagementClient {

	if (!KONTENT_PROJECT_ID || !KONTENTAI_KEY) {
		throw new Error("KontentAI EnVars Not Provided");
	}

	return createManagementClient({
		environmentId: KONTENT_PROJECT_ID,
		apiKey: KONTENTAI_KEY,
	});
}



export async function handleKontentCall<T>(
	promise: Promise<T>
): Promise<T | null> {
	try {
		return await promise;
	} catch (error: any) {
		// Safely extract only the fields we care about
		const status = error?.originalError?.response?.status ?? "unknown";
		const data = error?.originalError?.response?.data ?? {};
		const message =
			data?.message ||
			data?.error_message ||
			error?.message ||
			"Unknown error occurred.";

		// Extract validation errors if any
		const validationErrors: string[] = Array.isArray(data?.validation_errors)
			? data.validation_errors.map((v: any) => v?.message || JSON.stringify(v))
			: [];

		// Concise logging — no full request/response objects
		console.error(`❌ Kontent.ai SDK Error (status: ${status}): ${message}`);
		if (validationErrors.length > 0) {
			console.error("Validation errors:");
			for (const err of validationErrors) console.error(`  - ${err}`);
		}

		// Optional: log endpoint without body
		const endpoint = error?.originalError?.config?.url;
		if (endpoint) console.error("Endpoint:", endpoint);

		// Handle specific statuses
		switch (status) {
			case 404:
				console.warn("⚠️ Resource not found (404)");
				return null;
			case 401:
			case 403:
				console.error("🚫 Unauthorized — check your API key.");
				break;
			case 429:
				console.error("⏳ Rate limited — try again later.");
				break;
			case 400:
				console.error("⚠️ Bad Request — validation errors listed above.");
				break;
			default:
				console.error("🔥 Unknown error occurred.");
				break;
		}

		// Throw a sanitized error to prevent SDK dumping large JSON
		throw new Error(`Kontent.ai SDK Error (status: ${status}): ${message}`);
	}
}
