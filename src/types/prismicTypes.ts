/** Root Type — represents a single Prismic Custom Type (a “Page”) */
export interface PrismicPage {
	id: string;
	label: string;
	repeatable: boolean;
	status: boolean;
	format: string;
	json: Record<string, PrismicTab>; // Tabs, e.g. "Main", "Journal"
}

/** A Prismic Tab — contains fields (elements) and possibly slices */
export interface PrismicTab {
	[fieldKey: string]: PrismicElement | PrismicSliceZone;
}

/** A Prismic Slice Zone — a special field that holds slices */
export interface PrismicSliceZone {
	type: "Slices";
	fieldset: string;
	config: PrismicSliceZoneConfig;
}

/** Slice Zone configuration (labels and slice definitions) */
export interface PrismicSliceZoneConfig {
	labels?: Record<string, PrismicSliceLabel[]>;
	choices: Record<string, PrismicSliceDefinition>;
}

/** A label option that can be applied to a slice */
export interface PrismicSliceLabel {
	display: string;
	name: string;
}

/** A single slice type definition inside the slice zone */
export interface PrismicSliceDefinition {
	type: "Slice";
	fieldset: string;
	description?: string;
	icon?: string;
	display?: string;
	nonRepeat: Record<string, PrismicElement>;
	repeat: Record<string, PrismicElement>;
}

/** Core Element Type — all field types map to one of these */
export type PrismicElement =
	| PrismicTextField
	| PrismicStructuredTextField
	| PrismicNumberField
	| PrismicBooleanField
	| PrismicDateField
	| PrismicColorField
	| PrismicImageField
	| PrismicLinkField
	| PrismicGroupField;

/** --- Primitive Field Definitions --- */

export interface PrismicTextField {
	type: "Text";
	config: {
		label: string;
		useAsTitle?: boolean;
	};
}

export interface PrismicStructuredTextField {
	type: "StructuredText";
	config: {
		single?: string;
		multi?: string;
		label: string;
	};
}

export interface PrismicNumberField {
	type: "Number";
	config: {
		label: string;
	};
}

export interface PrismicBooleanField {
	type: "Boolean";
	config: {
		label: string;
		default_value?: boolean;
		placeholder_true?: string;
		placeholder_false?: string;
	};
}

export interface PrismicDateField {
	type: "Date" | "Timestamp";
	config: {
		label: string;
		default?: string;
	};
}

export interface PrismicColorField {
	type: "Color";
	config: {
		label: string;
	};
}

export interface PrismicImageField {
	type: "Image";
	config: {
		label: string;
		constraint?: Record<string, unknown>;
		thumbnails?: unknown[];
	};
}

export interface PrismicLinkField {
	type: "Link";
	config: {
		label: string;
		select: string | null;
		customtypes?: string[];
	};
}

/** Groups are like repeatable field sets (not slices) */
export interface PrismicGroupField {
	type: "Group";
	config: {
		label: string;
		fields: Record<string, PrismicElement>;
	};
}

export interface MappedPrismicPage {
	pageName: string;
	codename: string;
	tabs: MappedPrismicTab[];
}

export interface MappedPrismicTab {
	tabName: string;
	elements: MappedElement[];
	slices: MappedSlice[];
	groups: MappedGroup[];
}

export interface MappedElement {
	key: string;
	type: string;
	label: string;
	config?: Record<string, any>; // ← now carries config
}

export interface MappedSlice {
	sliceName: string;
	fieldset: string;
	description?: string;
	icon?: string;
	display?: string;
	elements: MappedElement[];
}

export interface MappedGroup {
	groupName: string;
	type: "Group"
	elements: MappedElement[];
}

