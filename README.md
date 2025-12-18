[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/@skillbill%2Freactlace.svg)](https://badge.fury.io/js/@skillbill%2Freactlace)

# Reactlace

Reactlace is a powerful UI component library built on top of Shoelace, designed to streamline the process of creating beautiful and responsive user interfaces for React applications leveraging the reliability of web components.

This is the React port of [Vuelace-3](https://github.com/Skillbill/vuelace-3).

## Features

- **Shoelace Web Components**: Leverages Shoelace's high-quality web components
- **PrimeReact Integration**: Complex components like DataTable, Calendar, and AutoComplete powered by PrimeReact
- **TypeScript Support**: Full type definitions included
- **Validation System**: Built-in validation hooks and rules
- **Customizable**: Easy theming through CSS variables

## Installation

### Using npm

```sh
npm i @skillbill/reactlace
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```sh
npm i react react-dom @shoelace-style/shoelace @mdi/svg primereact
```

## Usage

### Setup

Import library styles and wrap your app with the ReactlaceProvider:

```tsx
import '@skillbill/reactlace/styles/reactlace.css'
import '@skillbill/reactlace/styles/theme_primereact.css'
import { ReactlaceProvider } from '@skillbill/reactlace'

function App() {
  return (
    <ReactlaceProvider>
      <YourApp />
    </ReactlaceProvider>
  )
}
```

### Using Components

```tsx
import { RLButton, RLInput, RLSelect } from '@skillbill/reactlace'

function MyForm() {
  const [name, setName] = useState('')
  const [genre, setGenre] = useState<string | null>(null)

  return (
    <div>
      <RLInput
        label="Name"
        value={name}
        onChange={setName}
        rules={[
          {
            validateFn: (v) => v && v.length > 0,
            message: 'Name is required'
          }
        ]}
      />

      <RLSelect
        label="Favorite Genre"
        value={genre}
        onChange={setGenre}
        options={[
          { value: 'rock', text: 'Rock' },
          { value: 'pop', text: 'Pop' },
          { value: 'jazz', text: 'Jazz' }
        ]}
      />

      <RLButton variant="primary" onClick={() => console.log({ name, genre })}>
        Submit
      </RLButton>
    </div>
  )
}
```

### Add Icons

By default, the library uses [Material Design Icons](https://pictogrammers.com/library/mdi/).
It is possible to add/override current icons using the exposed functions:

```tsx
import cat from '@mdi/svg/svg/cat.svg'
import { addIcon } from '@skillbill/reactlace'

addIcon('cat', cat)
```

Then the icon is available and can be used:

```tsx
<RLIcon name="cat" />
```

### Customize Colors

It is possible to customize colors by overriding Shoelace design [tokens](https://shoelace.style/getting-started/customizing) in your CSS:

```css
:root {
  --sl-color-primary-50: var(--color-purple-50);
  --sl-color-primary-100: var(--color-purple-100);
  --sl-color-primary-200: var(--color-purple-200);
  --sl-color-primary-300: var(--color-purple-300);
  --sl-color-primary-400: var(--color-purple-400);
  --sl-color-primary-500: var(--color-purple-500);
  --sl-color-primary-600: var(--color-purple-600);
  --sl-color-primary-700: var(--color-purple-700);
  --sl-color-primary-800: var(--color-purple-800);
  --sl-color-primary-900: var(--color-purple-900);
  --sl-color-primary-950: var(--color-purple-950);
}
```

## Available Components

### Simple Wrappers (Shoelace)
- `RLButton` - Button component
- `RLIcon` - Icon component
- `RLTooltip` - Tooltip component
- `RLExpansionCard` - Expandable card component

### Input Components
- `RLInput` - Text input with validation
- `RLNumberInput` - Number input with validation
- `RLTextArea` - Multiline text input
- `RLCheckbox` - Checkbox with validation
- `RLRadioGroup` - Radio button group
- `RLSelect` - Select/dropdown component
- `RLColorPicker` - Color picker

### Complex Components
- `RLDialog` - Modal dialog
- `RLFileInput` - File upload input
- `RLImageUpload` - Image upload with preview
- `RLDatePicker` - Date/time picker (PrimeReact Calendar)
- `RLAutocomplete` - Autocomplete input (PrimeReact)
- `RLDataTableCrud` - Data table (PrimeReact DataTable)
- `RLDropdown` - Custom dropdown with keyboard navigation

### CRUD Components
- `RLCrud` - Full CRUD orchestration
- `RLCrudForm` - Form with validation
- `RLCrudFilters` - Filter panel
- `RLCrudInput` - Dynamic input type router
- `RLCrudAction` - Action button with tooltip
- `RLPaginator` - Pagination component

## Development

### Project Setup

```sh
npm install
```

### Run Storybook

```sh
npm run storybook
```

### Build

```sh
npm run build
```

### Type Check

```sh
npm run type-check
```

## Contribution

We welcome contributions from the community. If you find any issues or have ideas for improvements, please open an issue or submit a pull request.
