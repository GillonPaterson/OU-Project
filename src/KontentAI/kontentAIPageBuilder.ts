import { ContentTypeSnippetResponses, ManagementClient, SharedModels, ViewContentTypeSnippetQuery } from "@kontent-ai/management-sdk";
import {
	KontentPage,
	KontentTab,
	KontentCreateContentType,
	KontentTypeElement,
	KontentSnippetData,
	KontentElementType,
} from "../types/kontentTypes.ts";
import { ElementType } from "@kontent-ai/delivery-sdk";
import { MappedElement } from "../types/prismicTypes.ts";
import { toPrismicApiKey } from "./kontentElementBuilders.ts";
import { handleKontentCall, kontentManagementApi } from "../utils/kontentAIClient.ts";
import { error } from "console";
import { writeJsonToPrismic } from "../utils/logging.ts";

export async function checkIfSnippetsExists(
	page: KontentPage,
	kontentClient: ManagementClient
): Promise<KontentPage> {
	for (const tab of page.pageTabs) {
		for (const element of tab.pageElements) { 
			if (element.type == KontentElementType.Snippet) {
				const snippetID = await doesKontentSnippetExist(
					element.element.name
				);
				
				if (snippetID) {
					element.element.snippetID = snippetID;
				} else {

					const newSnippetID = await createKontentSnippet(element.element, kontentClient);
					
					if (newSnippetID) {
						element.element.snippetID = newSnippetID;
					} else {
						throw error(`failed to create snippet ${element.element}`);
					}
				}
			}
		};
	};

	return page;
}

export async function doesKontentSnippetExist(
	snippetCodeName: string,
): Promise<string | null> {
	try {

		const response = await kontentManagementApi.get(`/snippets/codename/${snippetCodeName}`);

		return response.data.id

	} catch (err: any) {
		console.log(err)
		return null;
	}
}

export async function createKontentSnippet(
	snippet: KontentSnippetData,
	client: ManagementClient
): Promise<string | null> {

	try {
		const response = await client.addContentTypeSnippet()
			.withData((builder) => {

				return {
					name: snippet.name,
					codename: toPrismicApiKey(snippet.name),
					elements: buildSnippetElements(builder, snippet),
				};
			})
			.toPromise()
		
		if (response) {
			return response.data.id;
		} else {
			return null;
		}
	} catch (err) {
		if (err instanceof SharedModels.ContentManagementBaseKontentError) {
			console.log(err.validationErrors);
			throw new Error(`Error when Creating Snippet`);
		} else {
			throw new Error(`Unkown Error Occurred when Creating Snippet ${err}`);
		}
	}

}

/**
 * Builds the Page in KontentAI Accepts a single Kontent Page
 * For Pages with multiple tabs the tabs elements are mapped individually and then flattened to one big array with the content-group specified for each element
 */
export async function kontentPageBuilder(page: KontentPage, client: ManagementClient) {

	try {
		const contentTypeResponse = await client.addContentType()
			.withData((builder) => {

				const contentGroups = buildCreateContentGroup(page.pageTabs);
				const elements = buildPageElements(builder, page.pageTabs);

				const typeData: any = {
					name: page.pageName,
					codename: page.codename,
					elements,
				};

				if (Array.isArray(contentGroups) && contentGroups.length > 1) {
					typeData.content_groups = contentGroups;
				}

				writeJsonToPrismic("FinalPageRender", typeData, "PrismicJsons");
				

				return typeData;
			})
			.toPromise()

		return contentTypeResponse;
	} catch (err) {
		if (err instanceof SharedModels.ContentManagementBaseKontentError) {
			console.log(err.validationErrors)
			throw new Error(`Error Creating Page: ${page.pageName}`)
		} else {
			throw new Error(`Error Creating Page: ${page.pageName}`);
		}	
	}	
}

/**
 * Accepts KontentElement and returns the builder.whateverElement to the request
 */
function buildElement(
	builder: any,
	element: KontentTypeElement
) {
	switch (element.type) {
		case ElementType.Text:
			return builder.textElement(element);
		case ElementType.RichText:
			return builder.richTextElement(element);
		case ElementType.Asset:
			return builder.assetElement(element);
		case ElementType.Number:
			return builder.numberElement(element);
		case ElementType.MultipleChoice:
			return builder.multipleChoiceElement(element);
		default:
			return builder.numberElement(element);
	}
}

function buildSnippetElements(builder: any, snippet: KontentSnippetData) {

	const snippetElements: any[] = [] 
	
	snippet.elements.forEach(
		(element) => {
			snippetElements.push(buildElement(builder, element));
		}
	);

	return snippetElements;
}

function buildPageElements(builder: any, pageTabs: KontentTab[]) {
	
	const pageElements: any[] = [];
	
	pageTabs.forEach(tab => {
		tab.pageElements.forEach(element => {
			if (element.type == KontentElementType.Element) {
				pageElements.push(buildElement(builder, element.element))
			} else if (element.type == KontentElementType.Snippet) {
				console.log("Snippet ID:", element.element.snippetID);
				pageElements.push({
					type: "snippet",
					snippet: {
						id: element.element.snippetID
					},					
					content_group: {
						codename: toPrismicApiKey(tab.tabName)
					}
				})

			}
			
		});
	})

	return pageElements;
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
