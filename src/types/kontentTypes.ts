import type {
	ContentTypeElements,
	ElementModels,
} from "@kontent-ai/management-sdk";
import {  } from "@kontent-ai/management-sdk";

type KontentAIElementType = ElementModels.ElementType;

export type KontentTypeElement =
	| ContentTypeElements.ITextElement
	| ContentTypeElements.IRichTextElement
	| ContentTypeElements.IAssetElement
	| ContentTypeElements.INumberElement
	| ContentTypeElements.IMultipleChoiceElement
	| ContentTypeElements.IUrlSlugElement
	| ContentTypeElements.IDateTimeElement
	| ContentTypeElements.ISnippetElement

export interface KontentPage {
	pageName: string;
	codename: string;
	pageTabs: KontentTab[];
}

export interface KontentTab {
	tabName: string;
	codeName: string;
	pageElements: KontentTypeElement[];
	snippets?: KontentSnippetData[];
	groups?: KontentGroupData[];
}

export interface KontentCreateContentType extends Array<CreateContentType> {}

export interface CreateContentType {
	name: string,
	codename: string,
	external_id?: string
}

export interface KontentGroupData {
	name: string;
	elements: KontentTypeElement[];
}
export interface KontentSnippetData {
	name: string;
	elements: KontentTypeElement[];
}

