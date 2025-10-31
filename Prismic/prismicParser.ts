import {
	PrismicField,
	PrismicPage,
	PrismicComponent,
	PrismicResponse,
} from "../types/prismicTypes";
import {
	KontentElement,
	KontentElementConfig,
	KontentPage,
} from "../types/kontentTypes";
import {
	buildTextElement,
	buildStructuredTextElement,
	buildSelectElement,
	buildLinkElement,
	buildNumberElement
} from "../KontentAI/kontentElementBuilders.ts";

/* 
    takes Json of Page elements and converts to an Array of Prismic Elements - returns Array
*/
export function splitPrismicComponents(
	page: Record<string, PrismicField>
): PrismicComponent[] {
	return Object.entries(page).map(([key, field]) => ({
		key,
		type: field.type,
		config: field.config,
	}));
}

export function splitPrismicPages(pages: PrismicPage[]) {
	const splitPrismicPages: {
		pageName: string;
		codename: string;
		pageElements: PrismicComponent[];
	}[] = [];

	pages.forEach((page) => {

		// TODO: Update page.Main to standard var to pass in from array of pages
		const splitPrismicPage = splitPrismicComponents(page.json.Main);

		splitPrismicPages.push({
			pageName: page.id,
			codename: page.id,
			pageElements: splitPrismicPage,
		});
	});

	return splitPrismicPages;
}

/*
    Accepts PrismicComponent and Calls relevant KontentAI component builder and returns the json for the element in KontentAI
 */
function mapPrismicToKontentElement(
	component: PrismicComponent
): KontentElementConfig {
	switch (component.type) {
		case "Text":
			return buildTextElement(component);
		case "StructuredText":
			return buildStructuredTextElement(component);
		case "Select":
			return buildSelectElement(component);
		case "Number":
			return buildNumberElement(component);
		case "Link":
			return buildLinkElement(component);
		default:
			throw new Error("Component Not found");
	}
}

export function ConvertPrismicElementsToKontentAI(
	prismicPages: PrismicPage[]
): KontentPage[] {
	const prismicPageElements = splitPrismicPages(prismicPages);

	const kontentMappedPage: KontentPage[] = [];

	prismicPageElements.forEach((page) => {
		const kontentMappedElement: KontentElementConfig[] = [];

		page.pageElements.forEach((element) => {
			const mappedElement = mapPrismicToKontentElement(element);
			kontentMappedElement.push(mappedElement);
		});
		kontentMappedPage.push({
			codename: page.codename,
			pageName: page.pageName,
			pageElements: kontentMappedElement,
		});
	});

	return kontentMappedPage;
}
