import "reflect-metadata"; // 👈 must be first!
import { container } from "./inversify.config";
import { Types } from "./types";
import { MigrateCustomTypesService } from "./Services/MigrateCustomTypesService";

(async () => {
	const migrateCustomTypes = container.get<MigrateCustomTypesService>(
		Types.MigrateCustomTypesService
	);
	await migrateCustomTypes.run();
})();
