import * as shoelace from '@shoelace-style/shoelace/dist/shoelace.js'
import { icons } from './icons'
import type {
  IconLibraryMutator,
  IconLibraryResolver
} from '@shoelace-style/shoelace/dist/components/icon/library.js'

const SHOELACE_ICONS_LIBRARY = 'shoelace'
const MDI_ICONS_LIBRARY = 'mdi'

export const useIcons = (library: string = 'mdi') => {
  if (library === SHOELACE_ICONS_LIBRARY) {
    shoelace.setBasePath('../node_modules/@shoelace-style/shoelace/dist')
  } else if (library === MDI_ICONS_LIBRARY) {
    overrideDefaultWithMdi()
    overrideSystemWithMdi()
  }
}

export const registerIconLibrary = (
  library: string,
  resolver: IconLibraryResolver,
  mutator?: IconLibraryMutator
) => {
  shoelace.registerIconLibrary(library, {
    resolver,
    mutator
  })
}

const overrideDefaultWithMdi = () => {
  shoelace.registerIconLibrary('default', {
    resolver: (name: string) => icons[name],
    mutator: (svg) => svg.setAttribute('fill', 'currentColor')
  })
}

const systemDictionary: Record<string, string> = {
  caret: 'chevronDown',
  check: 'check',
  'chevron-down': 'chevronDown',
  'chevron-left': 'chevronLeft',
  'chevron-right': 'chevronRight',
  copy: 'contentCopy',
  eye: 'eyeOutline',
  'eye-slash': 'eyeOffOutline',
  eyedropper: 'eyeDropper',
  'grip-vertical': 'dragVertical',
  indeterminate: 'minus',
  'person-fill': 'account',
  'play-fill': 'play',
  'pause-fill': 'pause',
  radio: 'circleMedium',
  'star-fill': 'star',
  'x-lg': 'windowClose',
  'x-circle-fill': 'closeCircle'
}

const overrideSystemWithMdi = () => {
  shoelace.registerIconLibrary('system', {
    resolver: (name: string) => {
      const mappedName = systemDictionary[name] || name
      return icons[mappedName]
    },
    mutator: (svg) => svg.setAttribute('fill', 'currentColor')
  })
}
