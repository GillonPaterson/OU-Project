import { PrismicPage } from "../Models/prismicTypes";
import { inject, injectable } from "inversify";
import { PrismicApi } from "../utils/AxiosIntances/PrismicAxiosInstance";
import { Logger } from "../utils/Logger";
import { Types } from "../types.ts";

@injectable()
export class PrismicClient {

    constructor(
        @inject(Types.Logger) private logger: Logger
    ) {}

    public fetchCustomTypes = async(): Promise<PrismicPage[]> => {
        
	try {
		const response = await PrismicApi.get("/customtypes");

		console.log("✅ Custom types fetched successfully!");

		const data: PrismicPage[] = response.data;


		console.log("✅ Logging Prismic Jsons");
		data.forEach((page) => {
			this.logger.writeJsonToLogs(page.id, page, "PrismicJsons");
		});
		

		return data;
	} catch (error: any) {
		throw new Error(
			"❌ Error fetching custom types:",
			error.response?.data || error.message
		);
	}
}
}