import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { MappedElement } from "../types/prismicTypes";


/**
 * Builders for common Prismic -> Kontent element translations.
 * Each function accepts a MappedElement and returns a KontentElement.
 * Each function also accepts a contentGroup that is only mapped if it is set - This is for pages with multiple tabs in Prismic
 */

export function buildTextElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.ITextElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "text",
		is_required: true,
		maximum_text_length: {
			applies_to: "characters",
			value: 50,
		},
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildBooleanElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IMultipleChoiceElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "multiple_choice",
		is_required: true,
		mode: "single",
		options: [
			{
				name: "True",
				codename: "true",
			},
			{
				name: "False",
				codename: "false",
			},
		],
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
		}
			: {}),
	};
}

export function buildAssetElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IAssetElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "asset",
		is_required: true,
		allowed_file_types:  "any",
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildDateTimeElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IDateTimeElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "date_time",
		is_required: true,
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildImageElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IAssetElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "asset",
		is_required: true,
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildNumberElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.INumberElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "number",
		is_required: true,
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildStructuredTextElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IRichTextElement {
	let table_format: Array<string> = [];

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	if (component.config.single) {
		table_format = component.config.single.split(",");
	} else if (component.config.multi) {
		table_format = component.config.multi.split(",");
	}
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "rich_text",
		is_required: true,
		// allowed_table_formatting: table_format as ContentTypeElements.RichTextAllowedFormatting[],
		allowed_table_formatting: [],
		allowed_blocks: ["text", "tables"],
		maximum_text_length: {
			applies_to: "characters",
			value: 50,
		},
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildSelectElement(
	component: MappedElement,
	contentGroup?: string
): ContentTypeElements.IMultipleChoiceElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}

	return {
		mode: "single",
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "multiple_choice",
		is_required: true,
		options: component.config.options.map((option: string) => {return mapToSelectOption(option)}),
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function buildLinkElement(
	component: MappedElement,
	depends_on?: string,
	contentGroup?: string
): ContentTypeElements.IUrlSlugElement {

	if (!component.config) {
		throw new Error("Config Not Found - Building Text Element");
	}
	
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		depends_on: {
			element: {
				codename: depends_on,
			},
		},
		type: "url_slug",
		is_required: true,
		...(contentGroup
			? {
					content_group: {
						external_id: contentGroup,
					},
			}
			: {}),
	};
}

export function toPrismicApiKey(fieldName: string): string {
	const normalized = fieldName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	const lowercased = normalized.toLowerCase();

	const sanitized = lowercased.replace(/[^a-z0-9]+/g, "_");

	const trimmed = sanitized.replace(/^_+|_+$/g, "");

	return trimmed;
}

function mapToSelectOption(
	optionName: string
): ContentTypeElements.IMultipleChoiceOption {
	return {
		name: optionName,
		codename: toPrismicApiKey(optionName),
	};
}
