// kontentTypes.ts
import { Elements as KontentElements } from "@kontent-ai/delivery-sdk";
import { ContentTypeElements } from "@kontent-ai/management-sdk";

// Each builder call returns one of these:
export type ContentTypeElement =
	| ContentTypeElements.ITextElement
	| ContentTypeElements.IRichTextElement
	| ContentTypeElements.IAssetElement
	| ContentTypeElements.INumberElement;

// The mapped element structure
export interface KontentElement {
	kontentType: string; // e.g. 'text', 'rich_text', etc
	kontentElement: KontentElementConfig;
}

export type KontentElementConfig =
	| KontentTextElementConfig
	| KontentRichTextElementConfig
	| KontentMultipleChoiceElementConfig
	| KontentUrlSlugElementConfig
	| KontentNumberElementConfig;

interface KontentBaseElementConfig {
	name: string;
	codename: string;
	type: string;
	is_required: boolean;
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

export interface KontentMultipleChoiceElementConfig extends KontentBaseElementConfig {
	options: string[];
}

export interface KontentUrlSlugElementConfig extends KontentBaseElementConfig {
	value: string;
}

export interface KontentPage {
	pageName: string;
	codename: string;
	pageElements: KontentElementConfig[];
}
