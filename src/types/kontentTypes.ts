import type {
	ContentTypeElements,
	ElementModels,
} from "@kontent-ai/management-sdk";
import {  } from "@kontent-ai/management-sdk";

type KontentAIElementType = ElementModels.ElementType;

export type ContentTypeElement =
	| ContentTypeElements.ITextElement
	| ContentTypeElements.IRichTextElement
	| ContentTypeElements.IAssetElement
	| ContentTypeElements.INumberElement;

export type KontentElementConfig =
	| KontentTextElementConfig
	| KontentRichTextElementConfig
	| KontentMultipleChoiceElementConfig
	| KontentUrlSlugElementConfig
	| KontentNumberElementConfig;


interface KontentBaseElementConfig {
	name: string;
	codename: string;
	type: KontentAIElementType;
	is_required: boolean;
	content_group?: {
		external_id: string;
	};
}

export interface KontentTextElementConfig extends KontentBaseElementConfig {
	maximum_text_length: {
		applies_to: string;
		value: number;
	};
}

export interface KontentNumberElementConfig extends KontentBaseElementConfig {}

export interface KontentRichTextElementConfig extends KontentTextElementConfig {
	allowed_table_formatting: string[];
	allowed_blocks: string[];
}

export interface KontentMultipleChoiceElementConfig
	extends KontentBaseElementConfig {
	options: string[];
}

export interface KontentUrlSlugElementConfig extends KontentBaseElementConfig {
	value: string | null | undefined;
}

export interface KontentPage {
	pageName: string;
	codename: string;
	pageTabs: KontentTab[];
}

export interface KontentTab {
	tabName: string;
	codeName: string;
	pageElements: KontentElementConfig[];
}

export interface KontentCreateContentType extends Array<CreateContentType> {}

export interface CreateContentType {
	name: string,
	codename: string,
	external_id?: string
}
