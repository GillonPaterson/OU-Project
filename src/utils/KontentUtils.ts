import { injectable } from "inversify";

@injectable()
export class KontentUtils {
    public toPrismicApiKey = (fieldName: string): string => {
        const normalized = fieldName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const lowercased = normalized.toLowerCase();

        const sanitized = lowercased.replace(/[^a-z0-9]+/g, "_");

        const trimmed = sanitized.replace(/^_+|_+$/g, "");

        return trimmed;
    }
}