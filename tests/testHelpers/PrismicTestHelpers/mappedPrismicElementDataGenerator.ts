import { MappedElementType, MappedPrismicElement } from "../../../src/Models/prismicTypes";
import { generatePrismicElementText } from "./mappedElementDataGenerators";

export function generateMappedPrismicElement(): MappedPrismicElement {
    return {
			type: MappedElementType.Element,
			element: generatePrismicElementText(),
		};

}