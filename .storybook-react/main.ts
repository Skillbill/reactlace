import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src-react/stories/docs',
      files: '*.mdx'
    },
    {
      directory: '../src-react/stories/components',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)'
    },
    {
      directory: '../src-react/stories/examples',
      files: '*.stories.@(js|jsx|mjs|ts|tsx)'
    }
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  staticDirs: ['../src-react/stories/docs/public'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {}
}

export default config
