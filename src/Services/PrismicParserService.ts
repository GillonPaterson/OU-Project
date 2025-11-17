import { inject, injectable } from "inversify";
import { MappedElement, MappedElementType, MappedPrismicElement, MappedPrismicPage, MappedPrismicTab, PrismicElement, PrismicPage } from "../Models/prismicTypes";
import { KontentUtils } from "../utils/KontentUtils";
import { KontentPage, KontentTab, MappedKontentElement, KontentTypeElement, KontentElementType } from "../Models/kontentTypes";
import { KontentElementBuilderService } from "./KontentElementBuilderService";
import { Logger } from "../utils/Logger";
import { Types } from "../types";

@injectable()
export class PrismicParserService {

    constructor(
        @inject(Types.KontentUtils) private kontentUtils: KontentUtils,
        @inject(Types.KontentElementBuilderService) private kontentElementBuilder: KontentElementBuilderService,
        @inject(Types.Logger) private logger: Logger
    ) {}

    public ConvertPrismicPageToKontentPage = (
        prismicPage: PrismicPage
    ): KontentPage => {
        const structuredPrismicPage: MappedPrismicPage = this.mapPrismicPageToStructuredLayout(prismicPage);

        const kontentPage: KontentPage = this.mapPrismicPagesToKontentPages(
            structuredPrismicPage
        );

        this.logger.writeJsonToLogs(kontentPage.pageName, kontentPage, "KontentAIJsons");

        return kontentPage;
    }

    private mapPrismicPageToStructuredLayout = (
        page: PrismicPage
    ): MappedPrismicPage => {
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
                        mappedTab.elements.push(
													this.mapSliceDefinition(
														this.kontentUtils.toPrismicApiKey(sliceDef.fieldset),
														sliceDef
													)
												);
                    }
                } else if (fieldValue.type == "Group") {
                    mappedTab.elements.push(this.mapGroupDefinition(fieldKey, fieldValue));
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
            mappedTab.depends_on = this.setDependsOn(mappedTab);
            tabs.push(mappedTab);
        }
    
        return {
					pageName: page.id,
					codename: this.kontentUtils.toPrismicApiKey(page.id),
					tabs: tabs,
				};
    }

    public mapPrismicPagesToKontentPages = (
        prismicPage: MappedPrismicPage,
    ) : KontentPage => {
        
            const kontentTabs: KontentTab[] = prismicPage.tabs.map((tab) => {

                if (prismicPage.tabs.length > 1) {

                    const content_group = this.kontentUtils.toPrismicApiKey(tab.tabName)

                    const kontentTabElements: MappedKontentElement[] = []

                    tab.elements.map((element) => {

                        if (element.type == MappedElementType.Group) {
                            const groupElements: KontentTypeElement[] = element.element.elements.map(element => {
                                return this.mapPrismicFieldToKontent(
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
                                return this.mapPrismicFieldToKontent(element, tab.depends_on)
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
                                element: this.mapPrismicFieldToKontent(element.element, tab.depends_on, content_group)
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
                            const slice_depends_on = this.findSnippetDependsOn(element);

                            const groupElements: KontentTypeElement[] =
                                element.element.elements.map((element) => {
                                    return this.mapPrismicFieldToKontent(element, slice_depends_on);
                                });

                            kontentTabElements.push({
                                type: KontentElementType.Snippet,
                                element: {
                                    name: element.element.groupName,
                                    elements: groupElements,
                                },
                            });
                        } else if (element.type == MappedElementType.Slice) {
                            const slice_depends_on = this.findSnippetDependsOn(element);

                            const sliceElements: KontentTypeElement[] =
                                element.element.elements.map((element) => {
                                    return this.mapPrismicFieldToKontent(element, slice_depends_on);
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
                                element: this.mapPrismicFieldToKontent(
                                    element.element,
                                    tab.depends_on
                                ),
                            });
                        }
                    });

                    return {
                        tabName: tab.tabName,
                        codeName: this.kontentUtils.toPrismicApiKey(tab.tabName),
                        pageElements: kontentTabElements,
                    };
                }
            })

            return {
                pageName: prismicPage.pageName,
                codename: this.kontentUtils.toPrismicApiKey(prismicPage.pageName),
                pageTabs: kontentTabs,
            };
    }

    private findSnippetDependsOn(snippet: MappedPrismicElement): string {
	switch (snippet.type) {
		case MappedElementType.Slice:
		case MappedElementType.Group: {
			const elements = Object.values(
				snippet.element.elements
			) as MappedElement[];

			for (const element of elements) {
				if (element.type !== "Link") {
					return this.kontentUtils.toPrismicApiKey(element.label);
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

    public mapPrismicFieldToKontent = (
        component: MappedElement,
        depends_on: string,
        contentGroup?: string
    ): KontentTypeElement => {

        switch (component.type) {
            case "Text":
                return this.kontentElementBuilder.buildTextElement(component, contentGroup);
            case "StructuredText":
                return this.kontentElementBuilder.buildStructuredTextElement(component, contentGroup);
            case "Select":
                return this.kontentElementBuilder.buildSelectElement(component, contentGroup);
            case "Number":
                return this.kontentElementBuilder.buildNumberElement(component, contentGroup);
            case "Link":
                return this.kontentElementBuilder.buildLinkElement(component, depends_on, contentGroup);
            case "Boolean":
                return this.kontentElementBuilder.buildBooleanElement(component, contentGroup);
            case "Image":
                return this.kontentElementBuilder.buildImageElement(component, contentGroup);
            case "Timestamp":
            case "Date":
                return this.kontentElementBuilder.buildDateTimeElement(component, contentGroup);
            default:
                this.logger.writeJsonToLogs("error", component, "PrismicJsons");
                throw new Error(`Component Not found ${component.type}`);
        }
    }

    private mapGroupDefinition = (
        groupName: string,
        groupDef: any
    ): MappedPrismicElement => {
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

    private mapSliceDefinition = (sliceName: string, sliceDef: any): MappedPrismicElement => {
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

    public setDependsOn = (tab: MappedPrismicTab) => {
        for (const element of tab.elements) {
            if (element.type === MappedElementType.Element) {
                return this.kontentUtils.toPrismicApiKey(element.element.label);
            }
        }
        
        throw new Error("No Element Found to base Link on")
    }


}

