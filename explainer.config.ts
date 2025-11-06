import { defineExplainerConfig } from "@/utils";

export default defineExplainerConfig({
  meta: {
    title: "Mineral framework",
    description:
      "Mineral is a Discord framework for designing discord bots in Dart",
    favicon: {
      href: "/favicon.ico",
      type: "image/svg+xml",
    },
    thumbnail: "/thumbnail.jpg",
  },
  urls: {
    github: "https://github.com/mineral-dart/core",
    getStarted: "/docs/guide/installation",
    documentation: "/docs/preface/welcome",
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
          description:
            "Design your first application step by step, from setup to deployment.",
          href: "/docs/guide/installation",
        },
        {
          label: "API",
          description:
            "Learn how to effectively use each framework component that enables interaction with Discord.",
          href: "/docs/api/environment-variables",
        },
        {
          label: "Concepts",
          description:
            "Discover and learn how each essential component of the framework works.",
          href: "/docs/concepts/immutability",
        },
        {
          label: "Examples",
          description:
            "Find several boilerplates as well as concrete examples of implementation.",
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
      href: "https://github.com/mineral-dart",
      icon: "mdi:github",
    },
  },
});
