import {
	createManagementClient,
	ContentTypeElements,
} from "@kontent-ai/management-sdk";
import * as dotenv from "dotenv";
import {
	KontentPage,
	ContentTypeElement,
	KontentElementConfig,
} from "../types/kontentTypes";
import { ElementType } from "@kontent-ai/delivery-sdk";

dotenv.config();
const KONTENT_PROJECT_ID = process.env.KONTENT_PROJECT_ID;
const KONTENTAI_KEY = process.env.KONTENTAI_KEY;

if (!KONTENT_PROJECT_ID || !KONTENTAI_KEY) {
	throw new Error("KontentAI EnVars Not Provided")
}

const client = createManagementClient({
	environmentId: KONTENT_PROJECT_ID, // id of your Kontent.ai environment
	apiKey: KONTENTAI_KEY, // Content management API token
});

export async function kontentPageBuilder(page: KontentPage) {
	const builtTypes: ContentTypeElements.ContentTypeElementModel[] = [];

	const contentTypeResponse = await client
		.addContentType()
		.withData((builder) => {
			page.pageElements.forEach((element) => {
				const builtElement = buildElement(builder, element);
				builtTypes.push(builtElement);
			});

			console.log(builtTypes);
			throw new Error("killed it")

			return {
				name: page.pageName,
				codename: page.codename,
				elements: builtTypes,
			};
		})
		.toPromise();

	console.log(
		`Created content type: ${contentTypeResponse.data.name} (codename: ${contentTypeResponse.data.codename})`
	);

	return contentTypeResponse;
}

function buildElement(
	builder: any,
	element: KontentElementConfig
): ContentTypeElement {
	switch (element.type) {
		case ElementType.Text:
			return builder.textElement(element);
		case ElementType.RichText:
			return builder.richTextElement(element);
		case "asset":
			return builder.assetElement(element);
		case "number":
			return builder.numberElement(element);
		default:
			return builder.numberElement(element);
	}
}
