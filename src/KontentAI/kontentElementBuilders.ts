import { PrismicComponent } from "../types/prismicTypes.ts";
import {
	KontentTextElementConfig,
	KontentRichTextElementConfig,
	KontentMultipleChoiceElementConfig,
	KontentUrlSlugElementConfig,
	KontentNumberElementConfig
} from "../types/kontentTypes.ts";


/**
 * Builders for common Prismic -> Kontent element translations.
 * Each function accepts a PrismicComponent and returns a KontentElement.
 * Each function also accepts a contentGroup that is only mapped if it is set - This is for pages with multiple tabs in Prismic
 */

export function buildTextElement(
	component: PrismicComponent,
	contentGroup?: string
): KontentTextElementConfig {
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

export function buildNumberElement(
	component: PrismicComponent,
	contentGroup?: string
): KontentNumberElementConfig {
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
	component: PrismicComponent,
	contentGroup?: string
): KontentRichTextElementConfig {
	let table_format: Array<string> = [];

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
		allowed_table_formatting: table_format,
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
	component: PrismicComponent,
	contentGroup?: string
): KontentMultipleChoiceElementConfig {
	if (!component.config.options) {
		throw new Error("Config Options Not Found - Building Select Element");
	}

	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "text",
		is_required: true,
		options: component.config.options,
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
	component: PrismicComponent,
	contentGroup?: string
): KontentUrlSlugElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: "url_slug",
		is_required: true,
		value: component.config.select,
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
