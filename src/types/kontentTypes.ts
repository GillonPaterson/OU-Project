import type {
	ContentTypeElements,
} from "@kontent-ai/management-sdk";
import {  } from "@kontent-ai/management-sdk";

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
	pageElements: MappedKontentElement[];
}

export type MappedKontentElement =
	| {
		type: KontentElementType.Element;
		element: KontentTypeElement;
	}
	| {
		type: KontentElementType.Snippet;
		element: KontentSnippetData;
	}

export enum KontentElementType {
	Element = "Element",
	Snippet = "Snippet",
}

export interface KontentCreateContentType extends Array<CreateContentType> {}

export interface CreateContentType {
	name: string,
	codename: string,
	external_id?: string
}

export interface KontentSnippetData {
	name: string;
	snippetID?: string;
	elements: KontentTypeElement[];
}

