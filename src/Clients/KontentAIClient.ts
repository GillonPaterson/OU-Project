import { inject, injectable } from "inversify";
import { SharedModels } from "@kontent-ai/management-sdk";
import { error } from "console";
import { KontentPage, KontentElementType, KontentSnippetData, KontentTypeElement, KontentTab, KontentCreateContentType } from "../Models/kontentTypes";
import { ElementType } from "@kontent-ai/delivery-sdk";
import { KontentUtils } from "../utils/KontentUtils";
import { kontentManagementApi } from "../utils/AxiosIntances/KontentAiAxiosInstance";
import { createKontentClient } from "../utils/kontentAIClientBuilder";
import { Types } from "../types";
import { Logger } from "../utils/Logger";

@injectable()
export class KontentAIClient {
	constructor(
		@inject(Types.KontentUtils) private kontentUtils: KontentUtils,
		@inject(Types.Logger) private logger: Logger
	) {}

	client = createKontentClient();

	public doesKontentSnippetExist = async (
		snippetCodeName: string
	): Promise<string | null> => {
		try {
			const response = await kontentManagementApi.get(
				`/snippets/codename/${snippetCodeName}`
			);

			return response.data.id;
		} catch (err: any) {
			return null;
		}
	};

	public kontentPageBuilder = async (
		page: KontentPage,
	) => {
		try {
			const contentTypeResponse = await this.client
				.addContentType()
				.withData((builder) => {
					const contentGroups = this.buildCreateContentGroup(page.pageTabs);
					const elements = this.buildPageElements(builder, page.pageTabs);

					const typeData: any = {
						name: page.pageName,
						codename: page.codename,
						elements,
					};

					if (Array.isArray(contentGroups) && contentGroups.length > 1) {
						typeData.content_groups = contentGroups;
					}

					return typeData;
				})
				.toPromise();

			return contentTypeResponse;
		} catch (err) {
			if (err instanceof SharedModels.ContentManagementBaseKontentError) {
				this.logger.logFail("Failed building Kontent Page", err.validationErrors)
				throw new Error(`Error Creating Page: ${page.pageName}`);
			} else {
				throw new Error(`Error Creating Page: ${page.pageName}`);
			}
		}
	};

	public checkIfSnippetsExists = async (
		page: KontentPage,
	): Promise<KontentPage> => {
		for (const tab of page.pageTabs) {
			for (const element of tab.pageElements) {
				if (element.type == KontentElementType.Snippet) {
					const snippetID = await this.doesKontentSnippetExist(
						element.element.name
					);

					if (snippetID) {
						element.element.snippetID = snippetID;
					} else {
						const newSnippetID = await this.createKontentSnippet(
							element.element,
						);

						if (newSnippetID) {
							element.element.snippetID = newSnippetID;
						} else {
							throw error(`failed to create snippet ${element.element}`);
						}
					}
				}
			}
		}

		return page;
	};

	public createKontentSnippet = async (
		snippet: KontentSnippetData,
	): Promise<string | null> => {
		try {
			const response = await this.client
				.addContentTypeSnippet()
				.withData((builder) => {
					return {
						name: snippet.name,
						type: "snippet",
						codename: this.kontentUtils.toPrismicApiKey(snippet.name),
						elements: this.buildSnippetElements(builder, snippet),
					};
				})
				.toPromise();

			if (response) {
				return response.data.id;
			} else {
				return null;
			}
		} catch (err) {
			if (err instanceof SharedModels.ContentManagementBaseKontentError) {
				this.logger.logFail("Failed building Kontent Snippet", err.validationErrors);
				throw new Error();
			} else {
				throw new Error(`Unkown Error Occurred when Creating Snippet ${err}`);
			}
		}
	};

	private buildSnippetElements = (
		builder: any,
		snippet: KontentSnippetData
	) => {
		const snippetElements: any[] = [];

		snippet.elements.forEach((element) => {
			snippetElements.push(this.buildElement(builder, element));
		});

		return snippetElements;
	};

	public buildPageElements = (builder: any, pageTabs: KontentTab[]) => {
		const pageElements: any[] = [];

		pageTabs.forEach((tab) => {
			tab.pageElements.forEach((element) => {
				if (element.type == KontentElementType.Element) {
					pageElements.push(this.buildElement(builder, element.element));
				} else if (element.type == KontentElementType.Snippet) {
					pageElements.push({
						type: "snippet",
						snippet: {
							id: element.element.snippetID,
						},
						content_group: {
							codename: this.kontentUtils.toPrismicApiKey(tab.tabName),
						},
					});
				}
			});
		});

		return pageElements;
	};

	private buildElement = (builder: any, element: KontentTypeElement) => {
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
	};

	private buildCreateContentGroup(
		tabs: KontentTab[]
	): KontentCreateContentType {
		const content_groups: KontentCreateContentType = [];

		tabs.forEach((tab) => {
			content_groups.push({
				name: tab.tabName,
				codename: tab.codeName,
			});
		});

		return content_groups;
	}
}

