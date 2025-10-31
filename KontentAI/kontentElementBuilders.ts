import { PrismicComponent } from "../types/prismicTypes";
import {
	KontentTextElementConfig,
	KontentRichTextElementConfig,
	KontentMultipleChoiceElementConfig,
	KontentUrlSlugElementConfig,
	KontentNumberElementConfig
} from "../types/kontentTypes";
import {
	Elements as KontentElements,
	ElementType,
} from "@kontent-ai/delivery-sdk";

/**
 * Builders for common Prismic -> Kontent element translations.
 * Each function accepts a PrismicComponent and returns a KontentElement.
 */

export function buildTextElement(
	component: PrismicComponent
): KontentTextElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: ElementType.Text,
		is_required: true,
		maximum_text_length: {
			applies_to: "characters",
			value: 50,
		},
	};
}

export function buildNumberElement(
	component: PrismicComponent
): KontentNumberElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: ElementType.Text,
		is_required: true,
	};
}

export function buildStructuredTextElement(
	component: PrismicComponent
): KontentRichTextElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: ElementType.Text,
		is_required: true,
		allowed_table_formatting: component.config.multi
			? component.config.multi.split(",")
			: component.config.single.split(','),
		allowed_blocks: ["text", "tables"],
		maximum_text_length: {
			applies_to: "characters",
			value: 50,
		},
	};
}

export function buildSelectElement(
	component: PrismicComponent
): KontentMultipleChoiceElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: ElementType.Text,
		is_required: true,
		options: component.config.options,
	};
}

export function buildLinkElement(
	component: PrismicComponent
): KontentUrlSlugElementConfig {
	return {
		name: component.config.label,
		codename: toPrismicApiKey(component.config.label),
		type: ElementType.Text,
		is_required: true,
		value: component.config.select,
	};
}

function toPrismicApiKey(fieldName: string): string {
	const normalized = fieldName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

	const lowercased = normalized.toLowerCase();

	const sanitized = lowercased.replace(/[^a-z0-9]+/g, "_");

	const trimmed = sanitized.replace(/^_+|_+$/g, "");

	return trimmed;
}
