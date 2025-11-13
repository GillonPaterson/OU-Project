import { buildBooleanElement, buildDateTimeElement, buildImageElement, buildLinkElement, buildNumberElement, buildSelectElement, buildStructuredTextElement, buildTextElement, toPrismicApiKey } from "../KontentAI/kontentElementBuilders.js";
import { KontentElementType, KontentPage, KontentTab, KontentTypeElement, MappedKontentElement } from "../types/kontentTypes.js";
import {
	MappedElement,
	MappedElementType,
	MappedPrismicElement,
	MappedPrismicPage,
	MappedPrismicTab,
	MappedSlice,
	PrismicElement,
	PrismicPage,
	PrismicSliceDefinition,
	PrismicTab,
} from "../types/prismicTypes.js";
import { writeJsonToPrismic } from "../utils/logging.js";

export function mapPrismicPageToStructuredLayout(
	page: PrismicPage
): MappedPrismicPage  {
	const tabs: MappedPrismicTab[] = [];

	for (const [tabName, tabContent] of Object.entries(page.json)) {
		const mappedTab: MappedPrismicTab = {
			tabName,
			depends_on: "",
			elements: []
		};

		for (const [fieldKey, fieldValue] of Object.entries(tabContent)) {
			if (fieldValue.type == "Slices") {
				for (const [sliceName, sliceDef] of Object.entries(
					fieldValue.config.choices
				)) {
					mappedTab.elements.push(mapSliceDefinition(toPrismicApiKey(sliceDef.fieldset), sliceDef));
				}
			} else if (fieldValue.type == "Group") {
				mappedTab.elements.push(mapGroupDefinition(fieldKey, fieldValue));
			} else {
				mappedTab.elements.push({
					type: MappedElementType.Element,
					element: {
						key: fieldKey,
						type: fieldValue.type,
						label: fieldValue.config?.label || "",
						config: fieldValue.config || {},
					},
				});
			}
		}
		mappedTab.depends_on = setDependsOn(mappedTab);
		tabs.push(mappedTab);
	}

	return {
		pageName: page.id,
		codename: toPrismicApiKey(page.id),
		tabs: tabs,
	};
}

function setDependsOn(tab: MappedPrismicTab) {
	for (const element of tab.elements) {
		if (element.type === MappedElementType.Element) {
			return toPrismicApiKey(element.element.label);
		}
	}
	
	throw new Error("No Element Found to base Link on")
}


function mapSliceDefinition(sliceName: string, sliceDef: any): MappedPrismicElement {
	const nonRepeatObj = sliceDef["non-repeat"] || sliceDef.nonRepeat || {};
	const repeatObj = sliceDef.repeat || {};

	const nonRepeat = Object.entries(nonRepeatObj).map(
		([key, val]: [string, any]) => ({
			key,
			type: val.type,
			label: val.config?.label || "",
			config: val.config || {},
		})
	);

	const repeat = Object.entries(repeatObj).map(([key, val]: [string, any]) => ({
		key,
		type: val.type,
		label: val.config?.label || "",
		config: val.config || {},
	}));

	return {
		type: MappedElementType.Slice,
		element: {
			sliceName,
			fieldset: sliceDef.fieldset,
			description: sliceDef.description,
			icon: sliceDef.icon,
			display: sliceDef.display,
			elements: [...repeat, ...nonRepeat],
		},
	};
}

function mapGroupDefinition(
	groupName: string,
	groupDef: any
): MappedPrismicElement {
	const mappedElements: MappedElement[] = [];

	for (const [elementName, elementDef] of Object.entries(
		groupDef.config.fields
	) as [string, PrismicElement][]) {
		mappedElements.push({
			key: elementName,
			type: elementDef.type,
			label: elementDef.config?.label || "",
			config: elementDef.config || {},
		});
	}

	return {
		type: MappedElementType.Group,
		element: {
			groupName: groupName,
			type: groupDef.type,
			elements: mappedElements,
		},
	};
}



/**
  * Accepts Multiple Prismic Pages maps each PrismicTabs Components to KontentAI Compontents and Returns Multiple Kontent Pages
  * If the json.length is greater than 1 .ie there is more than one tab then the tabName is passed to the Kontent mapper to create the content_group (tabs in kontent)
 */

export function mapPrismicPagesToKontentPages(
	prismicPage: MappedPrismicPage,
) : KontentPage {
	
		const kontentTabs: KontentTab[] = prismicPage.tabs.map((tab) => {

			if (prismicPage.tabs.length > 1) {

				const content_group = toPrismicApiKey(tab.tabName)

				const kontentTabElements: MappedKontentElement[] = []

				tab.elements.map((element) => {

					if (element.type == MappedElementType.Group) {
						const groupElements: KontentTypeElement[] = element.element.elements.map(element => {
							return mapPrismicFieldToKontent(
								element,
								tab.depends_on
							);
						});

						kontentTabElements.push({
							type: KontentElementType.Snippet,
							element: {
								name: element.element.groupName,
								elements: groupElements
							}
						})
					} else if (element.type == MappedElementType.Slice) {
						const sliceElements: KontentTypeElement[] =element.element.elements.map(element => {
							return mapPrismicFieldToKontent(element, tab.depends_on)
						});

						kontentTabElements.push({
							type: KontentElementType.Snippet,
							element: {
								name: element.element.sliceName,
								elements: sliceElements,
							},
						});

					} else {
						kontentTabElements.push({
							type: KontentElementType.Element,
							element: mapPrismicFieldToKontent(element.element, tab.depends_on, content_group)
						});
					}
				})

				return {
					tabName: tab.tabName,
					codeName: content_group,
					pageElements: kontentTabElements,
				};
			} else {
				const kontentTabElements: MappedKontentElement[] = [];

				tab.elements.map((element) => {
					if (element.type == MappedElementType.Group) {
						const slice_depends_on = findSnippetDependsOn(element);

						const groupElements: KontentTypeElement[] =
							element.element.elements.map((element) => {
								return mapPrismicFieldToKontent(element, slice_depends_on);
							});

						kontentTabElements.push({
							type: KontentElementType.Snippet,
							element: {
								name: element.element.groupName,
								elements: groupElements,
							},
						});
					} else if (element.type == MappedElementType.Slice) {
						const slice_depends_on = findSnippetDependsOn(element);

						const sliceElements: KontentTypeElement[] =
							element.element.elements.map((element) => {
								return mapPrismicFieldToKontent(element, slice_depends_on);
							});

						kontentTabElements.push({
							type: KontentElementType.Snippet,
							element: {
								name: element.element.sliceName,
								elements: sliceElements,
							},
						});
					} else {
						kontentTabElements.push({
							type: KontentElementType.Element,
							element: mapPrismicFieldToKontent(
								element.element,
								tab.depends_on
							),
						});
					}
				});

				return {
					tabName: tab.tabName,
					codeName: toPrismicApiKey(tab.tabName),
					pageElements: kontentTabElements,
				};
			}
		})

		return {
			pageName: prismicPage.pageName,
			codename: toPrismicApiKey(prismicPage.pageName),
			pageTabs: kontentTabs,
		};
}

function findSnippetDependsOn(snippet: MappedPrismicElement): string {
	switch (snippet.type) {
		case MappedElementType.Slice:
		case MappedElementType.Group: {
			const elements = Object.values(
				snippet.element.elements
			) as MappedElement[];

			for (const element of elements) {
				if (element.type !== "Link") {
					return toPrismicApiKey(element.label);
				}
			}

			throw new Error(
				`No element to depend on for link in ${snippet.type}: ${snippet}`
			);
		}

		default:
			throw new Error(
				`findSliceDependsOn called with unsupported type: ${snippet.type}`
			);
	}
}

// /**
//   *Accepts a single Prismic Component and routes it to the relevant function to return a Kontent Component
// */ 
function mapPrismicFieldToKontent(
	component: MappedElement,
	depends_on: string,
	contentGroup?: string
): KontentTypeElement {

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
			return buildLinkElement(component, depends_on, contentGroup);
		case "Boolean":
			return buildBooleanElement(component, contentGroup);
		case "Image":
			return buildImageElement(component, contentGroup);
		case "Timestamp":
		case "Date":
			return buildDateTimeElement(component, contentGroup);
		case "undefined":
			console.log("Undefined component type found", component);
		default:
			writeJsonToPrismic("error", component, "PrismicJsons");
			throw new Error(`Component Not found ${component.type}`);
	}
}

/**
  *Function to call supporting functions in here, Accepts PrismicResponse and return the KontentPages
*/ 
export function ConvertPrismicPageToKontentPage(
	prismicPage: PrismicPage
): KontentPage {
	const structuredPrismicPage: MappedPrismicPage = mapPrismicPageToStructuredLayout(prismicPage);

	const kontentPage: KontentPage = mapPrismicPagesToKontentPages(
		structuredPrismicPage
	);

	writeJsonToPrismic(kontentPage.pageName, kontentPage, "KontentAIJsons");

	return kontentPage;
}
