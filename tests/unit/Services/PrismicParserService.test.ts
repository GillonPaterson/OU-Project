import { KontentElementBuilderService } from "../../../src/Services/KontentElementBuilderService";
import { PrismicParserService } from "../../../src/Services/PrismicParserService"
import { KontentUtils } from "../../../src/utils/KontentUtils";
import { Logger } from "../../../src/utils/Logger";
import { generateIAssetElement, generateIBooleanElement, generateIDatetTimeElement, generateILinkElement, generateINumberElement, generateISelectElement, generateIStructuredTextElement, generateITextElement } from "../../testHelpers/KontentTestHelpers/contentTypeElementDataGenerators";
import { generatePrismicElementBoolean, generatePrismicElementDate, generatePrismicElementImage, generatePrismicElementLink, generatePrismicElementNotMapped, generatePrismicElementNumber, generatePrismicElementSelect, generatePrismicElementStructuredText, generatePrismicElementText, generatePrismicElementTimestamp } from "../../testHelpers/PrismicTestHelpers/mappedElementDataGenerators";
import { generateMappedPrismicTab } from "../../testHelpers/PrismicTestHelpers/mappedPrismicTabDataGenerator";

describe("PrismicParserService Tests", () => {

	const logger = new Logger();
    const kontentUtils = new KontentUtils()
    const kontentElementBuilderService = new KontentElementBuilderService(kontentUtils);
    
    const prismicParserService = new PrismicParserService(
			kontentUtils,
			kontentElementBuilderService,
			logger
		);

    describe("setDependsOn", () => {

        const mockPrismicTab = generateMappedPrismicTab()

        it("Should return the generated depends_on codename for the first element in the tab", () => {
            const result = prismicParserService.setDependsOn(mockPrismicTab);

            expect(result).toBe("text")
        })

        it("should throw and error if no element is found", () => {
            mockPrismicTab.elements = []

            expect(() =>
                prismicParserService.setDependsOn(mockPrismicTab)
            ).toThrow("No Element Found to base Link on");

        })

    })

    describe("mapPrismicFieldToKontent", () => {

        it("Should call buildTextElement when a text element is passed", () => {

            const mockMappedText = generatePrismicElementText()

            const buildTextElementSpy = jest
                .spyOn(kontentElementBuilderService, "buildTextElement")
                .mockReturnValue(generateITextElement());

            prismicParserService.mapPrismicFieldToKontent(mockMappedText, "depends_on")

            expect(buildTextElementSpy).toHaveBeenCalledTimes(1);
            expect(buildTextElementSpy).toHaveBeenCalledWith(mockMappedText, undefined)
        });

        it("Should call buildNumberElement when a Number element is passed", () => {
            const mockMappedNumber = generatePrismicElementNumber();

            const buildNumberElementSpy = jest
                .spyOn(kontentElementBuilderService, "buildNumberElement")
                .mockReturnValue(generateINumberElement());

            prismicParserService.mapPrismicFieldToKontent(mockMappedNumber, "depends_on");

            expect(buildNumberElementSpy).toHaveBeenCalledTimes(1);
            expect(buildNumberElementSpy).toHaveBeenCalledWith(
				mockMappedNumber,
				undefined
			);
        });

        it("Should call buildStructuredTextElement when a Structured Text element is passed", () => {
            const mockMappedStructuredText = generatePrismicElementStructuredText();

            const buildStructuredTextElementSpy = jest
                .spyOn(kontentElementBuilderService, "buildStructuredTextElement")
                .mockReturnValue(generateIStructuredTextElement());

            prismicParserService.mapPrismicFieldToKontent(
							mockMappedStructuredText,
							"depends_on"
						);

            expect(buildStructuredTextElementSpy).toHaveBeenCalledTimes(1);
            expect(buildStructuredTextElementSpy).toHaveBeenCalledWith(
				mockMappedStructuredText,
				undefined
			);
        });

        it("Should call buildSelectElement when a Multiple Choice element is passed", () => {
            const mockMappedSelect = generatePrismicElementSelect();

            const buildSelectElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildSelectElement")
				.mockReturnValue(generateISelectElement());

            prismicParserService.mapPrismicFieldToKontent(
				mockMappedSelect,
				"depends_on"
			);

            expect(buildSelectElementSpy).toHaveBeenCalledTimes(1);
            expect(buildSelectElementSpy).toHaveBeenCalledWith(
				mockMappedSelect,
				undefined
			);
        });

        it("Should call buildLinkElement when a Link element is passed", () => {
            const mockMappedLink = generatePrismicElementLink();

            const buildLinkElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildLinkElement")
				.mockReturnValue(generateILinkElement());

            prismicParserService.mapPrismicFieldToKontent(
				mockMappedLink,
				"depends_on"
			);

            expect(buildLinkElementSpy).toHaveBeenCalledTimes(1);
            expect(buildLinkElementSpy).toHaveBeenCalledWith(
				mockMappedLink,
				"depends_on",
                undefined
			);
        });

        it("Should call buildBooleanElement when a Boolean element is passed", () => {
			const mockMappedBoolean = generatePrismicElementBoolean();

			const buildImageElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildBooleanElement")
				.mockReturnValue(generateIBooleanElement());

			prismicParserService.mapPrismicFieldToKontent(
				mockMappedBoolean,
				"depends_on"
			);

			expect(buildImageElementSpy).toHaveBeenCalledTimes(1);
			expect(buildImageElementSpy).toHaveBeenCalledWith(
				mockMappedBoolean,
				undefined
			);
		});

        it("Should call buildImageElement when a Image element is passed", () => {
			const mockMappedImage = generatePrismicElementImage();

			const buildImageElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildImageElement")
				.mockReturnValue(generateIAssetElement());

			prismicParserService.mapPrismicFieldToKontent(
				mockMappedImage,
				"depends_on"
			);

			expect(buildImageElementSpy).toHaveBeenCalledTimes(1);
			expect(buildImageElementSpy).toHaveBeenCalledWith(
				mockMappedImage,
				undefined,
			);
		});

        it("Should call buildDateTimeElement when a Timestamp element is passed", () => {
			const mockMappedTimestamp = generatePrismicElementTimestamp();

			const buildTimestampElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildDateTimeElement")
				.mockReturnValue(generateIDatetTimeElement());

			prismicParserService.mapPrismicFieldToKontent(
				mockMappedTimestamp,
				"depends_on"
			);

			expect(buildTimestampElementSpy).toHaveBeenCalledTimes(1);
			expect(buildTimestampElementSpy).toHaveBeenCalledWith(
				mockMappedTimestamp,
				undefined
			);
		});

        it("Should call buildDateTimeElement when a Date element is passed", () => {
            const mockMappedDate = generatePrismicElementDate();

            const buildTimestampElementSpy = jest
				.spyOn(kontentElementBuilderService, "buildDateTimeElement")
				.mockReturnValue(generateIDatetTimeElement());

            prismicParserService.mapPrismicFieldToKontent(
				mockMappedDate,
				"depends_on"
			);

            expect(buildTimestampElementSpy).toHaveBeenCalledTimes(1);
            expect(buildTimestampElementSpy).toHaveBeenCalledWith(
				mockMappedDate,
				undefined
			);
        });
    })
    
})