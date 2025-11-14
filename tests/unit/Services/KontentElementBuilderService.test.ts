import { describe, expect, test } from "@jest/globals";
import { KontentElementBuilderService } from "../../../src/Services/KontentElementBuilderService";
import { KontentUtils } from "../../../src/utils/KontentUtils";
import { MappedElement } from "../../../src/Models/prismicTypes";
import {
	generatePrismicElementLink,
	generatePrismicElementNumber,
	generatePrismicElementSelect,
	generatePrismicElementStructuredText,
	generatePrismicElementText,
} from "../../testHelpers/PrismicTestHelpers/mappedElementDataGenerators";

describe("KontentElementBuilderService Tests", () => {


    const kontentUtils = new KontentUtils()
    const kontentElementBuilderService = new KontentElementBuilderService(kontentUtils);
    

    describe("buildTextElement", () => {

            const testComponent: MappedElement = generatePrismicElementText();

            it("Should Accept an Prismic Component and return a mapped kontent text type", () => {


                const result = kontentElementBuilderService.buildTextElement(testComponent);

                expect(result).not.toBeNull();
                expect(result.type).toBe("text");
                expect(result.name).toBe(testComponent.config?.label);
                expect(result.codename).toBe("page_title");
                expect(result.is_required).toBe(true);
                expect(result.maximum_text_length).toEqual({
                    applies_to: "characters",
                    value: 50,
                });
                expect(result).not.toHaveProperty("content_group");
            });

            it("Should Accept an Prismic Component and return a mapped kontent text type with content-group", () => {
                const contentGroup = "content_group_1";

                const result = kontentElementBuilderService.buildTextElement(
										testComponent,
										contentGroup
									);

                expect(result).not.toBeNull();
                expect(result.type).toBe("text");
                expect(result.name).toBe(testComponent.config?.label);
                expect(result.codename).toBe("page_title");
                expect(result.is_required).toBe(true);
                expect(result.maximum_text_length).toEqual({
                    applies_to: "characters",
                    value: 50,
                });
                expect(result).toHaveProperty("content_group");
                expect(result.content_group?.codename).toBe(contentGroup);
            });
    });

    describe("buildNumberElement", () => {

        const testComponent: MappedElement = generatePrismicElementNumber();

        it("Should Accept a Prismic Component and return a mapped kontent number type", () => {

            const result = kontentElementBuilderService.buildNumberElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("number");
            expect(result.name).toBe(testComponent.config?.label);
            expect(result.codename).toBe("page_number");
            expect(result.is_required).toBe(true);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {
            const contentGroup = "content_group_1";

            const result = kontentElementBuilderService.buildNumberElement(
							testComponent,
							contentGroup
						);

            expect(result.content_group?.codename).toBe(contentGroup);
        });
    });

    describe("buildStructuredTextElement", () => {

        const testComponent: MappedElement = generatePrismicElementStructuredText();

        it("Should Accept a Prismic Component and return a mapped kontent rich text type", () => {

            const result =
							kontentElementBuilderService.buildStructuredTextElement(
								testComponent
							);

            expect(result).not.toBeNull();
            expect(result.type).toBe("rich_text");
            expect(result.name).toBe(testComponent.config?.label);
            expect(result.codename).toBe("page_content");
            expect(result.is_required).toBe(true);
            expect(result.allowed_blocks).toEqual(["text", "tables"]);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {
            const contentGroup = "content_group_1";

            const result =
							kontentElementBuilderService.buildStructuredTextElement(
								testComponent,
								contentGroup
							);

            expect(result.content_group?.codename).toBe(contentGroup);
        });
    });

    describe("buildSelectElement", () => {

        const testComponent: MappedElement = generatePrismicElementSelect();

        it("Should Accept a Prismic Component and return a mapped kontent multiple choice type", () => {

            const result = kontentElementBuilderService.buildSelectElement(testComponent);

            const selectOptions = [
							{
								codename: "news",
								name: "News",
							},
							{
								codename: "blog",
								name: "Blog",
							},
							{
								codename: "article",
								name: "Article",
							},
						];

            expect(result).not.toBeNull();
            expect(result.type).toBe("multiple_choice");
            expect(result.name).toBe(testComponent.config?.label);
            expect(result.codename).toBe("page_category");
            expect(result.is_required).toBe(true);
            expect(result.options).toEqual(selectOptions);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should throw error when options are not provided", () => {
            let testComponent: MappedElement = {
							type: "Select",
							key: "Select",
							label: "Select",
						};

            expect(() =>
                kontentElementBuilderService.buildSelectElement(testComponent)
			).toThrow("Config Not Found - Building Select Element");
        });

        it("Should include content group when provided", () => {
            const testComponent: MappedElement = generatePrismicElementSelect();
            const contentGroup = "content_group_1";

            const result = kontentElementBuilderService.buildSelectElement(
							testComponent,
							contentGroup
						);

            expect(result.content_group?.codename).toBe(contentGroup);
        });
    });

    describe("buildLinkElement", () => {

        const testComponent: MappedElement = generatePrismicElementLink();

        it("Should Accept a Prismic Component and return a mapped kontent url slug type", () => {

            const result = kontentElementBuilderService.buildLinkElement(testComponent);

            expect(result).not.toBeNull();
            expect(result.type).toBe("url_slug");
            expect(result.name).toBe(testComponent.config?.label);
            expect(result.codename).toBe("page_url");
            expect(result.is_required).toBe(true);
            expect(result).not.toHaveProperty("content_group");
        });

        it("Should include content group when provided", () => {

            const contentGroup = "content_group_1";

            const result = kontentElementBuilderService.buildLinkElement(
							testComponent,
                            "depends_on_link",
							contentGroup
						);
            
            expect(result.content_group?.codename).toBe(contentGroup);
        });
    });
});