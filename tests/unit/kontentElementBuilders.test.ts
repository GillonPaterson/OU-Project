import { buildLinkElement, buildNumberElement, buildSelectElement, buildStructuredTextElement, buildTextElement } from "../../src/KontentAI/kontentElementBuilders";
import { PrismicComponent } from "../../src/types/prismicTypes";
import { generatePrismicComponentLink, generatePrismicComponentNumber, generatePrismicComponentSelect, generatePrismicComponentStructuredText, generatePrismicComponentText } from "../testHelpers/prismicDataGenerators";
import { describe, expect, test } from "@jest/globals";

describe("KontentElementBuilder Tests", () => {
    

    describe("buildTextElement", () => {

			it("Should Accept an Prismic Component and return a mapped kontent text type", () => {
				const testComponent: PrismicComponent = generatePrismicComponentText();

				const result = buildTextElement(testComponent);

                expect(result).not.toBeNull();
                expect(result.type).toBe("text");
                expect(result.name).toBe(testComponent.config.label);
                expect(result.codename).toBe("page_title");
                expect(result.is_required).toBe(true);
                expect(result.maximum_text_length).toEqual({
                    applies_to: "characters",
                    value: 50,
                });
                expect(result).not.toHaveProperty("content_group");
			});

            it("Should Accept an Prismic Component and return a mapped kontent text type with content-group", () => {
                const testComponent: PrismicComponent =
									generatePrismicComponentText();

                const contentGroup = "content_group_1";

                

                const result = buildTextElement(testComponent, contentGroup);

                expect(result).not.toBeNull();
                expect(result.type).toBe("text");
                expect(result.name).toBe(testComponent.config.label);
                expect(result.codename).toBe("page_title");
                expect(result.is_required).toBe(true);
                expect(result.maximum_text_length).toEqual({
                    applies_to: "characters",
                    value: 50,
                });
                expect(result).toHaveProperty("content_group");
                expect(result.content_group?.external_id).toBe(contentGroup);
            });
	});

    describe("buildNumberElement", () => {

        it("Should Accept a Prismic Component and return a mapped kontent number type", () => {
            const testComponent: PrismicComponent = generatePrismicComponentNumber();

            const result = buildNumberElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("number");
            expect(result.name).toBe(testComponent.config.label);
            expect(result.codename).toBe("page_number");
            expect(result.is_required).toBe(true);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {
            const testComponent: PrismicComponent = generatePrismicComponentNumber();
            const contentGroup = "content_group_1";

            const result = buildNumberElement(testComponent, contentGroup);

            expect(result.content_group?.external_id).toBe(contentGroup);
        });
    });

    describe("buildStructuredTextElement", () => {

        it("Should Accept a Prismic Component and return a mapped kontent rich text type", () => {
            const testComponent: PrismicComponent = generatePrismicComponentStructuredText();

            const result = buildStructuredTextElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("rich_text");
            expect(result.name).toBe(testComponent.config.label);
            expect(result.codename).toBe("page_content");
            expect(result.is_required).toBe(true);
            expect(result.allowed_blocks).toEqual(["text", "tables"]);
            expect(result.allowed_table_formatting).toEqual(["heading1", "heading2", "heading3", "paragraph"]);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {
            const testComponent: PrismicComponent = generatePrismicComponentStructuredText();
            const contentGroup = "content_group_1";

            const result = buildStructuredTextElement(testComponent, contentGroup);

            expect(result.content_group?.external_id).toBe(contentGroup);
        });
    });

    describe("buildSelectElement", () => {

        it("Should Accept a Prismic Component and return a mapped kontent multiple choice type", () => {
            const testComponent: PrismicComponent = generatePrismicComponentSelect();

            const result = buildSelectElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("text");
            expect(result.name).toBe(testComponent.config.label);
            expect(result.codename).toBe("page_category");
            expect(result.is_required).toBe(true);
            expect(result.options).toEqual(["News", "Blog", "Article"]);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should throw error when options are not provided", () => {
            const testComponent: PrismicComponent = {
                type: "Select",
                config: {
                    label: "invalid-select"
                }
            };

            expect(() => buildSelectElement(testComponent)).toThrow("Config Options Not Found - Building Select Element");
        });

        it("Should include content group when provided", () => {
            const testComponent: PrismicComponent = generatePrismicComponentSelect();
            const contentGroup = "content_group_1";

            const result = buildSelectElement(testComponent, contentGroup);

            expect(result.content_group?.external_id).toBe(contentGroup);
        });
    });

    describe("buildLinkElement", () => {

        it("Should Accept a Prismic Component and return a mapped kontent url slug type", () => {
            const testComponent: PrismicComponent = generatePrismicComponentLink();

            const result = buildLinkElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("url_slug");
            expect(result.name).toBe(testComponent.config.label);
            expect(result.codename).toBe("page_url");
            expect(result.is_required).toBe(true);
            expect(result.value).toBe("document");
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {
            const testComponent: PrismicComponent = generatePrismicComponentLink();
            const contentGroup = "content_group_1";

            const result = buildLinkElement(testComponent, contentGroup);

            expect(result.content_group?.external_id).toBe(contentGroup);
        });
    });
});