// Base type for any Prismic field
export interface BasePrismicField {
	type: string;
	config: Record<string, any>;
}

export interface StructuredTextField extends BasePrismicField {
	type: "StructuredText";
	config: {
		single?: string;
		multi?: string;
		label?: string;
	};
}

export interface LinkField extends BasePrismicField {
	type: "Link";
	config: {
		label?: string;
		select?: "document" | "media" | "web" | null;
	};
}

export interface ImageField extends BasePrismicField {
	type: "Image";
	config: {
		label?: string;
		constraint?: { width?: number; height?: number };
	};
}

export interface BooleanField extends BasePrismicField {
	type: "Boolean";
	config: { label?: string };
}

export interface NumberField extends BasePrismicField {
	type: "Number";
	config: { label?: string };
}

export interface DateField extends BasePrismicField {
	type: "Date" | "Timestamp";
	config: { label?: string };
}

export interface SliceField extends BasePrismicField {
	type: "Slice";
	config: { label?: string; fields: Record<string, PrismicField> };
}

// Union type
export type PrismicField =
	| StructuredTextField
	| LinkField
	| ImageField
	| BooleanField
	| NumberField
	| DateField
	| SliceField;

export interface PrismicPage {
	Main: Record<string, PrismicField>;
}

export interface PrismicComponent {
	key: string;
	type: string;
	config: Record<string, any>;
}

export enum PrismicKey {
	StructuredTextField,
	LinkField,
	ImageField,
	BooleanField,
	NumberField,
	DateField,
	SliceField,
}
export interface PrismicPage {
	id: string;
	json: Record<string, any>;
	label: string;
	repeatable: string;
	status: boolean;
	format: string;
}

export interface PrismicResponse {
	data: PrismicPage[];
}
