import "reflect-metadata";
import { KontentPage } from "../Models/kontentTypes";
import { inject, injectable } from "inversify";
import { PrismicClient } from "../Clients/PrismicClient";
import { PrismicParserService } from "./PrismicParserService";
import { KontentAIClient } from "../Clients/KontentAIClient";
import { Logger } from "../utils/Logger";
import { container } from "../inversify.config";
import { Types } from "../types";

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

		KontentAIPages.forEach((page) => {
			this.logger.writeJsonToLogs(page.pageName, page, "KontentAIJsons");
		});

		if (!process.env.MOCK_MODE) {
			const KontentPagesWithSnippets: KontentPage[] = [];

			for (const page of KontentAIPages) {
				KontentPagesWithSnippets.push(await this.kontentAiClient.checkIfSnippetsExists(page));
			}

			try {
				for (const page of KontentPagesWithSnippets) {
					await this.kontentAiClient.kontentPageBuilder(page);
					this.logger.logSuccess(`Created: ${page.pageName}`);
				}
			} catch (e) {
				this.logger.logFail(`Failed Making Kontent Page`, e);
			}
		} else {
			this.logger.logSuccess("Mock Run Completed");
		}
	};
}
