import { defineExplainerConfig } from '@/utils'

export default defineExplainerConfig({
  meta: {
    title: 'Mineral framework',
    description: 'Mineral is a Discord framework for designing discord bots in Dart',
    thumbnail: 'https://placehold.co/1200x630',
  },
  urls: {
    github: 'https://github.com/mineral-dart/core',
    getStarted: '/docs/framework/getting-started',
    documentation: '/docs/framework/installation'
  },
  docs: {
    guide: {
      icon: 'lucide:book-open',
      label: 'Guide',
      href: '/docs/guide/installation',
      baseUrl: '/docs/guide',
      baseRepositoryUrl: 'https://github.com/mineral-dart/website/blob/main',
    },
    api: {
      icon: 'lucide:code-xml',
      label: 'API',
      href: '/docs/api/events',
      baseUrl: '/docs/api',
      baseRepositoryUrl: 'https://github.com/mineral-dart/website/blob/main',
    },
    concepts: {
      icon: 'lucide:book-dashed',
      label: 'Concepts',
      href: '/docs/concepts/container',
      baseUrl: '/docs/concepts',
      baseRepositoryUrl: 'https://github.com/mineral-dart/website/blob/main',
    },
    examples: {
      icon: 'lucide:app-window-mac',
      label: 'Examples',
      href: '/docs/examples/ping-pong',
      baseUrl: '/docs/examples',
      baseRepositoryUrl: 'https://github.com/mineral-dart/website/blob/main',
    },
  },
  blog: {
    defaults: {
      thumbnail: 'https://placehold.co/1200x630',
    },
    authors: {
      leadcode_dev: {
        name: 'LeadcodeDev',
        avatar: 'https://avatars.githubusercontent.com/u/8946317?v=4',
        href: 'https://github.com/LeadcodeDev',
      },
    }
  },
  navbar: [
    {
      label: 'Docs',
      items: [
        {
          label: 'Guide',
          description: 'Build your first bot with the following guide.',
          href: '/docs/guide/installation',
        },
        {
          label: 'API',
          description: 'Learn the API of the framework.',
          href: '/docs/api/events',
        },
        {
          label: 'Concepts',
          description: 'Learn the concepts of the framework.',
          href: '/docs/concepts/container',
        },
        {
          label: 'Examples',
          description: 'Learn the examples of the framework.',
          href: '/docs/examples/ping-pong',
        },
      ],
    },
    {
      label: 'API',
      href: '/api',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
  ],
  social: {
    github: {
      href: 'https://github.com/LeadcodeDev/explainer',
      icon: 'mdi:github',
    },
  }
})