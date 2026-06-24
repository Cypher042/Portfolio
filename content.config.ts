import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: "page",
            source: "**/*.md",
            schema: z.object({
                image: z.string().optional(),
                created_at: z.number().int().positive().optional(),
                private: z.boolean().default(false),
            }),
        }),
    },
});
