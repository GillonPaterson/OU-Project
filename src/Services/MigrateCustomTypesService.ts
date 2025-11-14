import "reflect-metadata";
import { KontentPage } from "../Models/kontentTypes.ts";
import { inject, injectable } from "inversify";
import { PrismicClient } from "../Clients/PrismicClient.ts";
import { PrismicParserService } from "./PrismicParserService.ts";
import { KontentAIClient } from "../Clients/KontentAIClient.ts";
import { Logger } from "../utils/Logger.ts";
import { container } from "../inversify.config.ts";
import { Types } from "../types.ts";

@injectable()
export class MigrateCustomTypesService {
	constructor(
		@inject(Types.PrismicClient) private prismicClient: PrismicClient,
		@inject(Types.PrismicParserService) private prismicParser: PrismicParserService,
		@inject(Types.KontentClient) private kontentAiClient: KontentAIClient,
		@inject(Types.Logger) private logger: Logger
	) {}

	run = async () => {
		const prismicPagesJson = await this.prismicClient.fetchCustomTypes();

		const KontentAIPages = prismicPagesJson.map((page) => {
			return this.prismicParser.ConvertPrismicPageToKontentPage(page);
		});

		const KontentPagesWithSnippets: KontentPage[] = [];

		for (const page of KontentAIPages) {
			KontentPagesWithSnippets.push(
				await this.kontentAiClient.checkIfSnippetsExists(page)
			);
		}

		this.logger.writeJsonToLogs("kontent", KontentPagesWithSnippets, "PrismicJsons");

		try {
			for (const page of KontentPagesWithSnippets) {
				await this.kontentAiClient.kontentPageBuilder(page);
				console.log(`✅ Created: ${page.pageName}`);
			}
		} catch (e) {
			console.log(`Something went wrong: ${e}`);
		}
	};
}


