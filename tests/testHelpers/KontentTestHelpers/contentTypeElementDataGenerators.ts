import { ContentTypeElements } from "@kontent-ai/management-sdk";

export function generateITextElement(): ContentTypeElements.ITextElement {
    return {
        name: "test",
        type: "text"
    }

}

export function generateINumberElement(): ContentTypeElements.INumberElement {
	return {
		name: "test",
		type: "number",
	};
}

export function generateIStructuredTextElement(): ContentTypeElements.IRichTextElement {
	return {
		name: "test",
		type: "rich_text",
	};
}

export function generateISelectElement(): ContentTypeElements.IMultipleChoiceElement {
	return {
		name: "test",
		type: "multiple_choice",
        options: [],
        mode: "single"
	};
}

export function generateILinkElement(): ContentTypeElements.IUrlSlugElement {
	return {
		name: "test",
		type: "url_slug",
        depends_on: {
            element: {}
        }
	};
}

export function generateIBooleanElement(): ContentTypeElements.IMultipleChoiceElement {
	return {
		name: "test",
		type: "multiple_choice",
		options: [
            {
                name: "True",
                codename: "true"
            },
            {
                name: "False",
                codename: "false"
            }
        ],
		mode: "single",
	};
}

export function generateIAssetElement(): ContentTypeElements.IAssetElement {
	return {
		name: "test",
		type: "asset",
	};
}

export function generateIDatetTimeElement(): ContentTypeElements.IDateTimeElement {
	return {
		name: "test",
		type: "date_time",
	};
}