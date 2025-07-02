import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

export const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  permalink: z.string().optional(),
  order: z.number(),
  icon: z.string().optional(),
})

const guide = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/guide" }),
  schema: docSchema
})

const api = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/api" }),
  schema: docSchema
})

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/concepts" }),
  schema: docSchema
})

const examples = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs/examples" }),
  schema: docSchema
})

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    thumbnail: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publishedAt: z.string().optional()
  }),
})

export const collections = { blog, guide, api, concepts, examples };