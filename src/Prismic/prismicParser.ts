import {
	PrismicComponent,
	PrismicPage,
	PrismicResponse,
	PrismicTab,
} from "../types/prismicTypes";
import {
	KontentElementConfig,
	KontentPage,
	KontentTab,
	
} from "../types/kontentTypes";
import {
	buildTextElement,
	buildStructuredTextElement,
	buildSelectElement,
	buildLinkElement,
	buildNumberElement,
	toPrismicApiKey
} from "../KontentAI/kontentElementBuilders.ts";

/**  
  *Accepts the Prismic Response and Maps the Prismic Tabs Elements from a Object to an Array of Objects and returns and Array of Prismic Pages
*/
export function splitPrismicPageComponents(pages: PrismicResponse): PrismicPage[] {
	return pages.map((page) => {
		const { json, ...pageRest } = page;

		const prismicTabs: PrismicTab[] = [];

		for (const [tabName, components] of Object.entries(json)) {
			const componentsArray: PrismicComponent[] = Object.entries(
				components
			).map(([key, components]) => ({
				id: key,
				...components,
			}));

			const prismicTab: PrismicTab = {
				tabName: tabName,
				components: componentsArray,
			};

			prismicTabs.push(prismicTab);
		}

		return {
			...pageRest,
			json: prismicTabs,
		} as PrismicPage;
	});
}

/**
  * Accepts Multiple Prismic Pages maps each PrismicTabs Components to KontentAI Compontents and Returns Multiple Kontent Pages
  * If the json.length is greater than 1 .ie there is more than one tab then the tabName is passed to the Kontent mapper to create the content_group (tabs in kontent)
 */
function mapPrismicPageToKontentPage(pages: PrismicPage[]): KontentPage[] {

	return pages.map((page) => {
		const { json, ...pageRest } = page;

		const KontentTabs: KontentTab[] = [];

		for (const tab of json) {
			const kontentTabElements: KontentElementConfig[] = tab.components.map(
				(component) => {
					if (json.length > 1) {
						return mapPrismicComponentToKontent(
							component,
							toPrismicApiKey(tab.tabName)
						);
					}
					return mapPrismicComponentToKontent(component);
				}
			);

			const kontentTab: KontentTab = {
				tabName: tab.tabName,
				codeName: toPrismicApiKey(tab.tabName),
				pageElements: kontentTabElements,
			};

			KontentTabs.push(kontentTab);
		}
		
		return {
			pageName: pageRest.id,
			codename: toPrismicApiKey(pageRest.id),
			pageTabs: KontentTabs,
		}; 
	});
}

/**
  *Accepts a single Prismic Component and routes it to the relevant function to return a Kontent Component
*/ 
function mapPrismicComponentToKontent(component: PrismicComponent, contentGroup?: string): KontentElementConfig {
	switch (component.type) {
	case "Text":
		return buildTextElement(component, contentGroup);
	case "StructuredText":
		return buildStructuredTextElement(component, contentGroup);
	case "Select":
		return buildSelectElement(component, contentGroup);
	case "Number":
		return buildNumberElement(component, contentGroup);
	case "Link":
		return buildLinkElement(component, contentGroup);
	default:
		throw new Error("Component Not found");
}

}

/**
  *Function to call supporting functions in here, Accepts PrismicResponse and return the KontentPages
*/ 
export function ConvertPrismicElementsToKontentAI(
	prismicPages: PrismicResponse
) : KontentPage[] {

	const splitPrismicPages = splitPrismicPageComponents(prismicPages);

	const kontentPages = mapPrismicPageToKontentPage(splitPrismicPages);

	return kontentPages;
}
