import { Container } from "inversify";
import { Types } from "./types.ts";
import { PrismicClient } from "./Clients/PrismicClient";
import { KontentAIClient } from "./Clients/KontentAIClient";
import { KontentUtils } from "./utils/KontentUtils";
import { KontentElementBuilderService } from "./Services/KontentElementBuilderService";
import { Logger } from "./utils/Logger";
import { MigrateCustomTypesService } from "./Services/MigrateCustomTypesService.ts"
import { PrismicParserService } from "./Services/PrismicParserService.ts";

const container = new Container();

// Clients
container.bind<PrismicClient>(Types.PrismicClient).to(PrismicClient);
container.bind<KontentAIClient>(Types.KontentClient).to(KontentAIClient);

// Utils
container.bind<KontentUtils>(Types.KontentUtils).to(KontentUtils);
container.bind<Logger>(Types.Logger).to(Logger);

// Services
container
	.bind<KontentElementBuilderService>(Types.KontentElementBuilderService)
	.to(KontentElementBuilderService);
container
	.bind<MigrateCustomTypesService>(Types.MigrateCustomTypesService)
	.to(MigrateCustomTypesService);
container
	.bind<PrismicParserService>(Types.PrismicParserService)
	.to(PrismicParserService);

export { container };
