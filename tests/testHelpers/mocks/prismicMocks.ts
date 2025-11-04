import { PrismicResponse } from "../../../src/types/prismicTypes";

export const mockPrismicCustomTypes = [
    {
        id: "blog_post",
        label: "Blog post",
        repeatable: true,
        status: true,
        json: {
            Main: {
                title: {
                    type: "Text",
                    config: {
                        label: "Title",
                        placeholder: "Enter the post title",
                    },
                },
                body: {
                    type: "RichText",
                    config: {
                        label: "Body",
                        multi: "paragraph,heading3,preformatted",
                    },
                },
                publish_date: {
                    type: "Date",
                    config: { label: "Publish date" },
                },
                author: {
                    type: "Link",
                    config: { label: "Author", select: "document" },
                },
                hero_image: {
                    type: "Image",
                    config: {
                        label: "Hero image",
                        constraint: { width: 1200, height: 600 },
                    },
                },
            },
        },
    },
    {
        id: "author",
        label: "Author",
        repeatable: true,
        status: true,
        json: {
            Main: {
                name: {
                    type: "Text",
                    config: { label: "Full name" },
                },
                bio: {
                    type: "StructuredText",
                    config: { label: "Short bio", multi: "paragraph" },
                },
                email: {
                    type: "Text",
                    config: { label: "Email" },
                },
                avatar: {
                    type: "Image",
                    config: { label: "Avatar", constraint: { width: 400, height: 400 } },
                },
            },
        },
    },
    {
        id: "site_settings",
        label: "Site settings",
        repeatable: false,
        status: true,
        json: {
            Main: {
                site_title: {
                    type: "Text",
                    config: { label: "Site title" },
                },
                site_description: {
                    type: "Text",
                    config: { label: "Site description" },
                },
                logo: {
                    type: "Image",
                    config: { label: "Logo", constraint: { width: 300, height: 100 } },
                },
                footer_links: {
                    type: "Group",
                    config: {
                        label: "Footer links",
                        fields: {
                            label: { type: "Text", config: { label: "Link label" } },
                            url: {
                                type: "Link",
                                config: { label: "URL", select: "document,media" },
                            },
                        },
                    },
                },
            },
        },
    },
] as unknown as PrismicResponse;
