import axios from "axios";
import { PrismicPage, PrismicResponse } from "./types/prismicTypes.ts";
import { writeJsonToPrismic } from "./utils/logging.ts";
import { kontentPageBuilder } from "./KontentAI/kontentAIPageBuilder.ts";
import * as dotenv from "dotenv";
import { ConvertPrismicElementsToKontentAI } from "./Prismic/prismicParser.ts";

dotenv.config();
const PRISMIC_REPO_NAME = process.env.PRISMIC_REPO_NAME;
const PRISMIC_API_KEY = process.env.PRISMIC_ACCESS_TOKEN;
const API_URL = `https://customtypes.prismic.io/customtypes`;


/* 
    Makes Prismic Call returns JSon of All Pages elements - Logs the Json to PrismicJsons Folder and returns the json
*/
async function fetchCustomTypes(): Promise<PrismicResponse> {
	try {
		const response = await axios.get(API_URL, {
			headers: {
				repository: PRISMIC_REPO_NAME,
				Authorization: PRISMIC_API_KEY,
			},
		});

		console.log("✅ Custom types fetched successfully!");

		const data: PrismicResponse = response.data;

		console.log("✅ Logging Prismic Jsons");
		data.forEach((page) => {
			writeJsonToPrismic(page.id, page.json, "PrismicJsons");
		});

		return data;
	} catch (error: any) {
		throw new Error(
			"❌ Error fetching custom types:",
			error.response?.data || error.message
		);
	}
}

export async function migrateCustomTypes() {
	const prismicPagesJson = await fetchCustomTypes();

	const kontentMappedPages = ConvertPrismicElementsToKontentAI(prismicPagesJson);

	console.log("✅ Logging Mapped KontentAI Jsons");
	kontentMappedPages.forEach((page) => {
		writeJsonToPrismic(page.pageName, page.pageTabs, "KontentAIJsons");
	});

	// Function Call to Write to KontentAI
	// kontentMappedPages.forEach(async (page) => {
	// 	try {
	// 		await kontentPageBuilder(page);
	// 	} catch (e) {
	// 		console.log("Something Went Wrong", e);
	// 	}
	// });
}

migrateCustomTypes();

