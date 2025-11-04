import {
	createManagementClient,
	ContentTypeElements,
} from "@kontent-ai/management-sdk";
import * as dotenv from "dotenv";
import {
	KontentPage,
	ContentTypeElement,
	KontentElementConfig,
	KontentTab,
	KontentCreateContentType,
} from "../types/kontentTypes.ts";
import { ElementType } from "@kontent-ai/delivery-sdk";

dotenv.config();
const KONTENT_PROJECT_ID = process.env.KONTENT_PROJECT_ID;
const KONTENTAI_KEY = process.env.KONTENTAI_KEY;

if (!KONTENT_PROJECT_ID || !KONTENTAI_KEY) {
	throw new Error("KontentAI EnVars Not Provided")
}

const client = createManagementClient({
	environmentId: KONTENT_PROJECT_ID, // id of your Kontent.ai environment
	apiKey: KONTENTAI_KEY, // Content management API token
});

/**
 * Builds the Page in KontentAI Accepts a single Kontent Page
 * For Pages with multiple tabs the tabs elements are mapped individually and then flattened to one big array with the content-group specified for each element
 */
export async function kontentPageBuilder(page: KontentPage) {

	const contentTypeResponse = await client
		.addContentType()
		.withData((builder) => {
			
			if (page.pageTabs.length > 1 ) {
				const contentGroups = buildCreateContentGroup(page.pageTabs)

				page.pageTabs.map(tab => {
					return tab.pageElements.map(element => {
						return buildElement(builder, element);
					}) 
				})

				const allElements = page.pageTabs.flatMap((tab) => tab.pageElements);
				
				throw new Error("killed it")

				return {
					name: page.pageName,
					codename: page.codename,
					content_groups: contentGroups,
					elements: allElements,
				};
			}

			page.pageTabs.map(tab => {
				return tab.pageElements.map(element => {
					return buildElement(builder, element);
				})
			})

			throw new Error("killed it")

			return {
				name: page.pageName,
				codename: page.codename,
				elements: page.pageTabs[0].pageElements,
			};
		})
		.toPromise();

	console.log(
		`Created content type: ${contentTypeResponse.data.name} (codename: ${contentTypeResponse.data.codename})`
	);

	return contentTypeResponse;
}

/**
 * Accepts KontentElement and returns the builder.whateverElement to the request
 */
function buildElement(
	builder: any,
	element: KontentElementConfig
): ContentTypeElement {
	switch (element.type) {
		case ElementType.Text:
			return builder.textElement(element);
		case ElementType.RichText:
			return builder.richTextElement(element);
		case "asset":
			return builder.assetElement(element);
		case "number":
			return builder.numberElement(element);
		default:
			return builder.numberElement(element);
	}
}

/**
 * Accepts Multiple KontentTabs and creates the json Request for contentGroups to make tabs in KontentAI  
*/
function buildCreateContentGroup(tabs: KontentTab[]): KontentCreateContentType {
	const content_groups: KontentCreateContentType = [];

	tabs.forEach((tab) => {
		content_groups.push({
			name: tab.tabName,
			codename: tab.codeName,
		});
	});

	return content_groups
}
