import { MappedPrismicTab } from "../../../src/Models/prismicTypes";
import { generateMappedPrismicElement } from "./mappedPrismicElementDataGenerator";

export function generateMappedPrismicTab () : MappedPrismicTab {
    return {
			tabName: "test-tab",
			depends_on: "depends_on",
			elements: [generateMappedPrismicElement()],
		};

}