import { buildBooleanElement, buildDateTimeElement, buildImageElement, buildLinkElement, buildNumberElement, buildSelectElement, buildStructuredTextElement, buildTextElement, toPrismicApiKey } from "../KontentAI/kontentElementBuilders.js";
import { KontentGroupData, KontentPage, KontentSnippetData, KontentTab, KontentTypeElement } from "../types/kontentTypes.js";
import {
	MappedElement,
	MappedGroup,
	MappedPrismicPage,
	MappedPrismicTab,
	MappedSlice,
	PrismicElement,
	PrismicGroupField,
	PrismicPage,
	PrismicSliceDefinition,
	PrismicSliceZone,
} from "../types/prismicTypes";
import { writeJsonToPrismic } from "../utils/logging.js";

export function mapPrismicPageToStructuredLayout(
	page: PrismicPage
): MappedPrismicPage {
	const tabs: MappedPrismicTab[] = [];

	for (const [tabName, tabContent] of Object.entries(page.json)) {
		const mappedTab: MappedPrismicTab = {
			tabName,
			elements: [],
			slices: [],
			groups: [],
		};

		for (const [fieldKey, fieldValue] of Object.entries(tabContent)) {
			if (isSliceZone(fieldValue)) {
				// Handle slices
				for (const [sliceName, sliceDef] of Object.entries(
					fieldValue.config.choices
				)) {
					mappedTab.slices.push(mapSliceDefinition(sliceName, sliceDef));
				}
			} else if (isGroupComponent(fieldValue)) {
				console.log("here");
				mappedTab.groups.push(mapGroupDefinition(fieldKey, fieldValue));
			} else {
				mappedTab.elements.push({
					key: fieldKey,
					type: fieldValue.type,
					label: fieldValue.config?.label || "",
					config: fieldValue.config || {},
				});
			}
		}

		tabs.push(mappedTab);
	}

	return {
		pageName: page.id,
		codename: toPrismicApiKey(page.id),
		tabs: tabs,
	};
}

function isSliceZone(field: any): field is PrismicSliceZone {
	return field?.type === "Slices" && !!field.config?.choices;
}

function isGroupComponent(field: any): field is PrismicGroupField {
	return field?.type === "Group"
}

function mapSliceDefinition(sliceName: string, sliceDef: any): MappedSlice {
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
		sliceName,
		fieldset: sliceDef.fieldset,
		description: sliceDef.description,
		icon: sliceDef.icon,
		display: sliceDef.display,
		elements: [...repeat, ...nonRepeat],
	};
}

function mapGroupDefinition(
	groupName: string,
	groupDef: any
): MappedGroup {

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
		groupName: groupName,
		type: groupDef.type,
		elements: mappedElements,
	};
}



/**
  * Accepts Multiple Prismic Pages maps each PrismicTabs Components to KontentAI Compontents and Returns Multiple Kontent Pages
  * If the json.length is greater than 1 .ie there is more than one tab then the tabName is passed to the Kontent mapper to create the content_group (tabs in kontent)
 */

export function mapPrismicPagesToKontentPages(
	prismicPages: MappedPrismicPage[],
): KontentPage[] {
	
	const KontentPages: KontentPage[] = prismicPages.map((prismicPage) => {

		const kontentTabs: KontentTab[] = prismicPage.tabs.map((tab) => {

			if (prismicPage.tabs.length > 1) {

				const kontentElements: KontentTypeElement[] = tab.elements.map((element) => {
					return mapPrismicFieldToKontent(element, tab.tabName);
				});

				const kontentSnippets: KontentSnippetData[] = tab.slices.map((slice) => {
						const kontentElements = slice.elements.map((element) => {
							return mapPrismicFieldToKontent(element, tab.tabName);
						})

						return {
							name: slice.sliceName,
							elements: kontentElements
						}
					}
				);

				const kontentGroups: KontentGroupData[] = tab.groups.map((group) => {
					const kontentGroupElements = group.elements.map(element => {
						return mapPrismicFieldToKontent(element, tab.tabName);
					});

					return {
						name: group.groupName,
						elements: kontentGroupElements,
					};
				});

				return {
					tabName: tab.tabName,
					codeName: toPrismicApiKey(tab.tabName),
					pageElements: kontentElements,
					snippets: kontentSnippets,
					groups: kontentGroups,
				};



			} else {

				const kontentElements: KontentTypeElement[] = tab.elements.map(
					(element) => {
						return mapPrismicFieldToKontent(element);
					}
				);

				const kontentSnippets: KontentSnippetData[] = tab.slices.map(
					(slice) => {
						const kontentElements = slice.elements.map((element) => {
							return mapPrismicFieldToKontent(element);
						});

						return {
							name: slice.sliceName,
							elements: kontentElements,
						};
					}
				);

				const kontentGroups: KontentGroupData[] = tab.groups.map(
					(group) => {
						const kontentGroupElements = group.elements.map(
							(element) => {
								return mapPrismicFieldToKontent(element);
							}
						);

						return {
							name: group.groupName,
							elements: kontentGroupElements,
						};
					}
				);

				return {
					tabName: tab.tabName,
					codeName: toPrismicApiKey(tab.tabName),
					pageElements: kontentElements,
					snippets: kontentSnippets,
					groups: kontentGroups,
				};


			}

		})

		return {
			pageName: prismicPage.pageName,
			codename: prismicPage.codename,
			pageTabs: kontentTabs,
		}

	})

	return KontentPages;
}


// /**
//   *Accepts a single Prismic Component and routes it to the relevant function to return a Kontent Component
// */ 
function mapPrismicFieldToKontent(
	component: MappedElement,
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
			return buildLinkElement(component, contentGroup);
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
export function ConvertPrismicElementsToKontentAI(prismicPages: PrismicPage[]): KontentPage[] {
	
	const structuredPrismicPage: MappedPrismicPage[] = prismicPages.map(page => {
		return mapPrismicPageToStructuredLayout(page)
	})



	const kontentPages = mapPrismicPagesToKontentPages(structuredPrismicPage);

	writeJsonToPrismic("KontentPages", kontentPages, "PrismicJsons");

	return kontentPages;
}
