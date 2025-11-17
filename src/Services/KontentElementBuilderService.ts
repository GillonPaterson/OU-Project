import { ContentTypeElements } from "@kontent-ai/management-sdk";
import { inject, injectable } from "inversify";
import { MappedElement } from "../Models/prismicTypes";
import { KontentUtils } from "../utils/KontentUtils";
import { Types } from "../types";

@injectable()
export class KontentElementBuilderService {

    constructor(
        @inject(Types.KontentUtils) private kontentUtils: KontentUtils
    ) {}

    public buildTextElement =(
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.ITextElement => {
    
        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }
    
        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "text",
            is_required: true,
            maximum_text_length: {
                applies_to: "characters",
                value: 50,
            },
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildBooleanElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.IMultipleChoiceElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }

        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
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
                            codename: contentGroup,
                        },
            }
                : {}),
        };
    }


    public buildAssetElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.IAssetElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }

        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "asset",
            is_required: true,
            allowed_file_types:  "any",
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildDateTimeElement = (
	component: MappedElement,
	contentGroup?: string
    ): ContentTypeElements.IDateTimeElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }

        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "date_time",
            is_required: true,
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildImageElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.IAssetElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }

        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "asset",
            is_required: true,
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildNumberElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.INumberElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }

        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "number",
            is_required: true,
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildStructuredTextElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.IRichTextElement => {
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
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
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
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildSelectElement = (
        component: MappedElement,
        contentGroup?: string
    ): ContentTypeElements.IMultipleChoiceElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Select Element");
        }

        return {
            mode: "single",
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
            type: "multiple_choice",
            is_required: true,
            options: component.config.options.map((option: string) => {return this.mapToSelectOption(option)}),
            ...(contentGroup
                ? {
                        content_group: {
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    public buildLinkElement = (
        component: MappedElement,
        depends_on?: string,
        contentGroup?: string
    ): ContentTypeElements.IUrlSlugElement => {

        if (!component.config) {
            throw new Error("Config Not Found - Building Text Element");
        }
        
        return {
            name: component.config.label,
            codename: this.kontentUtils.toPrismicApiKey(component.config.label),
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
                            codename: contentGroup,
                        },
                }
                : {}),
        };
    }

    private mapToSelectOption = (
        optionName: string
    ): ContentTypeElements.IMultipleChoiceOption => {
        return {
            name: optionName,
            codename: this.kontentUtils.toPrismicApiKey(optionName),
        };
    }
}