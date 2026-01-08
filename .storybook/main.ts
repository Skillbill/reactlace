import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src/stories/docs',
      files: '*.mdx'
    },
    {
      directory: '../src/stories/components',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)'
    },
    {
      directory: '../src/stories/examples',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)'
    }
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  staticDirs: ['../src/stories/docs/public'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {}
}

export default config
