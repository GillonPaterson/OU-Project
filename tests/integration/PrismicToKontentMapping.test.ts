import { generatePrismicResponse } from "../testHelpers/PrismicTestHelpers/prismicResponseDataGenerator";
import { MigrateCustomTypesService } from "../../src/Services/MigrateCustomTypesService";
import { PrismicClient } from "../../src/Clients/PrismicClient";
import { Logger } from "../../src/utils/Logger";
import { KontentAIClient } from "../../src/Clients/KontentAIClient";
import { KontentUtils } from "../../src/utils/KontentUtils";
import { PrismicParserService } from "../../src/Services/PrismicParserService";
import { KontentElementBuilderService } from "../../src/Services/KontentElementBuilderService";
import { generateKontentPageData } from "../testHelpers/KontentTestHelpers/kontentPageDataGenerator";

describe("Mapping Prismic Page to KontentAI Page", () => {
	const logger = new Logger();
	const kontentUtils = new KontentUtils();
	const kontentElementBuilderService = new KontentElementBuilderService(kontentUtils);

	let prismicClient: PrismicClient;
	let kontentClient: KontentAIClient;
	let prismicParserService: PrismicParserService;
	let migrateCustomTypesService: MigrateCustomTypesService;

	beforeEach(() => {
		prismicClient = new PrismicClient(logger);
		kontentClient = new KontentAIClient(kontentUtils, logger);

		prismicParserService = new PrismicParserService(kontentUtils, kontentElementBuilderService, logger);

		migrateCustomTypesService = new MigrateCustomTypesService(prismicClient, prismicParserService, kontentClient, logger);
	});

	it("Should Map a Prismic Page to a KontentAI Page", async () => {
		const mockPrismicPage = [generatePrismicResponse()];

		const mockKontentPage = generateKontentPageData();

		const prismicClientSpy = jest.spyOn(prismicClient, "fetchCustomTypes").mockResolvedValue(mockPrismicPage);

		const prismicParserSpy = jest.spyOn(prismicParserService, "ConvertPrismicPageToKontentPage");

		const kontentSnippetSpy = jest.spyOn(kontentClient, "checkIfSnippetsExists").mockImplementation((page) => Promise.resolve(page));

		const kontentPageBuilderSpy = jest.spyOn(kontentClient, "kontentPageBuilder");

		await migrateCustomTypesService.run();

		expect(prismicClientSpy).toHaveBeenCalledTimes(1);
		expect(prismicParserSpy).toHaveBeenCalledTimes(mockPrismicPage.length);
		expect(kontentSnippetSpy).toHaveBeenCalledTimes(mockPrismicPage.length);
		expect(kontentPageBuilderSpy).toHaveBeenCalledTimes(mockPrismicPage.length);
		expect(kontentPageBuilderSpy).toHaveBeenCalledWith(mockKontentPage);
	});
});
