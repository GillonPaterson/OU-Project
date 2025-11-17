import { PrismicPage } from "../../../src/Models/prismicTypes"

export function generatePrismicResponse(): PrismicPage {
    return {
		id: "multiple-pages",
		json: {
			Main: {
				pge_title: {
					type: "StructuredText",
					config: {
						single: "heading2,heading3,heading4,heading5",
						label: "pGe title",
					},
				},
				number_field: {
					type: "Number",
					config: {
						label: "number field",
					},
				},
			},
			"Another Page": {
				another_pages_text: {
					type: "StructuredText",
					config: {
						multi: "paragraph,preformatted,heading2,heading4,heading5,heading6,em,image,list-item,o-list-item,rtl",
						label: "Another Pages Text",
					},
				},
			},
		},
		label: "multiple-pages",
		repeatable: false,
		status: true,
		format: "custom",
	};
}