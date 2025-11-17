import { KontentElementType, KontentPage } from "../../../src/Models/kontentTypes";

export function generateKontentPageData(): KontentPage {
	return {
		pageName: "multiple-pages",
		codename: "multiple_pages",
		pageTabs: [
			{
				tabName: "Main",
				codeName: "main",
				pageElements: [
					{
						type: KontentElementType.Element,
						element: {
							name: "pGe title",
							codename: "pge_title",
							type: "rich_text",
							is_required: true,
							allowed_table_formatting: [],
							allowed_blocks: ["text", "tables"],
							maximum_text_length: {
								applies_to: "characters",
								value: 50,
							},
							content_group: {
								codename: "main",
							},
						},
					},
					{
						type: KontentElementType.Element,
						element: {
							name: "number field",
							codename: "number_field",
							type: "number",
							is_required: true,
							content_group: {
								codename: "main",
							},
						},
					},
				],
			},
			{
				tabName: "Another Page",
				codeName: "another_page",
				pageElements: [
					{
						type: KontentElementType.Element,
						element: {
							name: "Another Pages Text",
							codename: "another_pages_text",
							type: "rich_text",
							is_required: true,
							allowed_table_formatting: [],
							allowed_blocks: ["text", "tables"],
							maximum_text_length: {
								applies_to: "characters",
								value: 50,
							},
							content_group: {
								codename: "another_page",
							},
						},
					},
				],
			},
		],
	};
}
