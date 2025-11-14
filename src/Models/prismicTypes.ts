export interface PrismicPage {
	id: string;
	label: string;
	repeatable: boolean;
	status: boolean;
	format: string;
	json: Record<string, PrismicTab>;
}

export interface PrismicTab {
	[fieldKey: string]: PrismicElement | PrismicSliceZone;
}

export interface PrismicSliceZone {
	type: "Slices";
	fieldset: string;
	config: PrismicSliceZoneConfig;
}

export interface PrismicSliceZoneConfig {
	labels?: Record<string, PrismicSliceLabel[]>;
	choices: Record<string, PrismicSliceDefinition>;
}

export interface PrismicSliceLabel {
	display: string;
	name: string;
}

export interface PrismicSliceDefinition {
	type: "Slice";
	fieldset: string;
	description?: string;
	icon?: string;
	display?: string;
	nonRepeat: Record<string, PrismicElement>;
	repeat: Record<string, PrismicElement>;
}

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
	depends_on: string
	elements: MappedPrismicElement[];
}

export type MappedPrismicElement =
	| {
			type: MappedElementType.Element;
			element: MappedElement;
	}
	| {
			type: MappedElementType.Slice;
			element: MappedSlice;
	}
	| {
			type: MappedElementType.Group;
			element: MappedGroup;
	};

export enum MappedElementType {
	Element = "Element",
	Slice = "Slice",
	Group = "Group",
}

export interface MappedElement {
	key: string;
	type: string;
	label: string;
	config?: Record<string, any>;
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

