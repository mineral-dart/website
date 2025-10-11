import { defineExplainerConfig } from "@/utils";

export default defineExplainerConfig({
  meta: {
    title: "Mineral framework",
    description:
      "Mineral is a Discord framework for designing discord bots in Dart",
    thumbnail: "https://placehold.co/1200x630",
  },
  urls: {
    github: "https://github.com/mineral-dart/core",
    getStarted: "/docs/framework/getting-started",
    documentation: "/docs/framework/installation",
  },
  docs: {
    _default: {
      source: {
        docs: "https://github.com/mineral-dart/website/blob/main",
        issues: "https://github.com/mineral-dart/core",
      },
    },
    preface: {
      icon: "lucide:house",
      label: "Preface",
      href: "/docs/preface/welcome",
      baseUrl: "/docs/preface",
    },
    guide: {
      icon: "lucide:book-open",
      label: "Guide",
      href: "/docs/guide/installation",
      baseUrl: "/docs/guide",
    },
    api: {
      icon: "lucide:code-xml",
      label: "API",
      href: "/docs/api/events",
      baseUrl: "/docs/api",
    },
    concepts: {
      icon: "lucide:book-dashed",
      label: "Concepts",
      href: "/docs/concepts/immutability",
      baseUrl: "/docs/concepts",
    },
    examples: {
      icon: "lucide:app-window-mac",
      label: "Examples",
      href: "/docs/examples/ping-pong",
      baseUrl: "/docs/examples",
    },
  },
  blog: {
    defaults: {
      thumbnail: "https://placehold.co/1200x630",
    },
    authors: {
      leadcode_dev: {
        name: "LeadcodeDev",
        avatar: "https://avatars.githubusercontent.com/u/8946317?v=4",
        href: "https://github.com/LeadcodeDev",
      },
    },
  },
  navbar: [
    {
      label: "Docs",
      items: [
        {
          label: "Guide",
          description: "Build your first bot with the following guide.",
          href: "/docs/guide/installation",
        },
        {
          label: "API",
          description: "Learn the API of the framework.",
          href: "/docs/api/events",
        },
        {
          label: "Concepts",
          description: "Learn the concepts of the framework.",
          href: "/docs/concepts/immutability",
        },
        {
          label: "Examples",
          description: "Learn the examples of the framework.",
          href: "/docs/examples/ping-pong",
        },
      ],
    },
    {
      label: "API",
      href: "https://pub.dev/packages/mineral/versions/4.0.0-dev.11",
      target: "_blank",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  social: {
    github: {
      href: "https://github.com/LeadcodeDev/explainer",
      icon: "mdi:github",
    },
  },
});
