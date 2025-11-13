import axios from "axios";
import { PrismicPage } from "./types/prismicTypes.ts";
import { writeJsonToPrismic } from "./utils/logging.ts";
import * as dotenv from "dotenv";
import { ConvertPrismicPageToKontentPage } from "./Prismic/prismicParser.ts";

dotenv.config();
const PRISMIC_REPO_NAME = process.env.PRISMIC_REPO_NAME;
const PRISMIC_API_KEY = process.env.PRISMIC_ACCESS_TOKEN;
const API_URL = `https://customtypes.prismic.io/customtypes`;
import { KontentPage } from "./types/kontentTypes.ts";
import { checkIfSnippetsExists, kontentPageBuilder } from "./KontentAI/kontentAIPageBuilder.ts";
import { createKontentClient } from "./utils/kontentAIClient.ts";

if (!PRISMIC_REPO_NAME || !PRISMIC_API_KEY) {
	throw new Error("Prismic EnVars Not Provided");
}

/* 
    Makes Prismic Call returns JSon of All Pages elements - Logs the Json to PrismicJsons Folder and returns the json
*/
export async function fetchCustomTypes(): Promise<PrismicPage[]> {
	try {
		const response = await axios.get(API_URL, {
			headers: {
				repository: PRISMIC_REPO_NAME,
				Authorization: PRISMIC_API_KEY,
			},
		});

		console.log("✅ Custom types fetched successfully!");

		const data: PrismicPage[] = response.data;


		console.log("✅ Logging Prismic Jsons");
		data.forEach((page) => {
			writeJsonToPrismic(page.id, page, "PrismicJsons");
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

	const kontentClient = createKontentClient()

	const KontentAIPages = prismicPagesJson.map((page) => {
		return ConvertPrismicPageToKontentPage(page);
	});

	const KontentPagesWithSnippets: KontentPage[] = [];

	for (const page of KontentAIPages) {
		KontentPagesWithSnippets.push(await checkIfSnippetsExists(page, kontentClient))
	}

	writeJsonToPrismic("kontent", KontentPagesWithSnippets, "PrismicJsons");

	try {
		for (const page of KontentPagesWithSnippets) {
			await kontentPageBuilder(page, kontentClient);
			console.log(`✅ Created: ${page.pageName}`);
		}
	} catch (e) {
		console.log(`Something went wrong: ${e}`)
	}
}

migrateCustomTypes();


