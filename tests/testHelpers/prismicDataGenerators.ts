import { PrismicComponent } from "../../src/types/prismicTypes";

export function generatePrismicComponentText(): PrismicComponent {
	return 	{
		type: "Text",
		config: {
			label: "page-title",
			single: "heading1,heading2,heading3,heading4,heading5,heading6",
		}
	}
}

export function generatePrismicComponentNumber(): PrismicComponent {
	return {
		type: "Number",
		config: {
			label: "page-number",
		},
	};
}

export function generatePrismicComponentStructuredText(): PrismicComponent {
	return {
		type: "StructuredText",
		config: {
			label: "page-content",
			single: "heading1,heading2,heading3,paragraph",
		},
	};
}

export function generatePrismicComponentSelect(): PrismicComponent {
	return {
		type: "Select",
		config: {
			label: "page-category",
			options: ["News", "Blog", "Article"],
		},
	};
}

export function generatePrismicComponentLink(): PrismicComponent {
	return {
		type: "Link",
		config: {
			label: "page-url",
			select: "document",
		},
	};
}