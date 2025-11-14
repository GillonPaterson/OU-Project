import { MappedElement } from "../../../src/Models/prismicTypes";

export function generatePrismicElementText(): MappedElement {
	return {
		key: "Text",
		label: "Text",
		type: "Text",
		config: {
			label: "page-title",
			single: "heading1,heading2,heading3,heading4,heading5,heading6",
		},
	};
}

export function generatePrismicElementNumber(): MappedElement {
	return {
		key: "Number",
		label: "Number",
		type: "Number",
		config: {
			label: "page-number",
		},
	};
}

export function generatePrismicElementStructuredText(): MappedElement {
	return {
		key: "StructuredText",
		label: "StrucutredText",
		type: "StructuredText",
		config: {
			label: "page-content",
			single: "heading1,heading2,heading3,paragraph",
		},
	};
}

export function generatePrismicElementSelect(): MappedElement {
	return {
		key: "Select",
		label: "Select",
		type: "Select",
		config: {
			label: "page-category",
			options: ["News", "Blog", "Article"],
		},
	};
}

export function generatePrismicElementLink(): MappedElement {
	return {
		key: "Link",
		label: "Link",
		type: "Link",
		config: {
			label: "page-url",
			select: "document",
		},
	};
}

export function generatePrismicElementImage(): MappedElement {
	return {
		key: "Image",
		label: "Image",
		type: "Image",
		config: {
			label: "Image",
		},
	};
}

export function generatePrismicElementBoolean(): MappedElement {
	return {
		key: "Boolean",
		label: "Boolean",
		type: "Boolean",
		config: {
			label: "Boolean",
		},
	};
}

export function generatePrismicElementTimestamp(): MappedElement {
	return {
		key: "Timestamp",
		label: "Timestamp",
		type: "Timestamp",
		config: {
			label: "Timestamp",
		},
	};
}

export function generatePrismicElementDate(): MappedElement {
	return {
		key: "Date",
		label: "Date",
		type: "Date",
		config: {
			label: "Date",
		},
	};
}

export function generatePrismicElementNotMapped(): MappedElement {
	return {
		key: "Random",
		label: "Random",
		type: "Random",
		config: {
			label: "Random",
		},
	};
}