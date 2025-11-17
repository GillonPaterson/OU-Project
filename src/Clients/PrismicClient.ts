import { PrismicPage } from "../Models/prismicTypes";
import { inject, injectable } from "inversify";
import { PrismicApi } from "../utils/AxiosIntances/PrismicAxiosInstance";
import { Logger } from "../utils/Logger";
import { Types } from "../types";

@injectable()
export class PrismicClient {

    constructor(
        @inject(Types.Logger) private logger: Logger
    ) {}

    public fetchCustomTypes = async(): Promise<PrismicPage[]> => {
        
	try {
		const response = await PrismicApi.get("/customtypes");

		this.logger.logSuccess("Custom types fetched successfully!");

		const data: PrismicPage[] = response.data;


		this.logger.logSuccess("Logging Prismic Jsons");
		data.forEach((page) => {
			this.logger.writeJsonToLogs(page.id, page, "PrismicJsons");
		});
		

		return data;
	} catch (error: any) {
		this.logger.logFail("Error fetching custom types:", error);
		throw new Error()
	}
}
}