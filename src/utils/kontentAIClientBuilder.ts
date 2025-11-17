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
