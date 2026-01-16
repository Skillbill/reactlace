import type { CSSProperties } from 'react'
import type { RLFileInputErrorEvent } from '../RLFileInput'
import type { RLInputRuleType } from '../utils/types'
import type { RLSelectOptionType } from '../RLSelect'

export type RLCrudInputValueType = string | string[] | boolean | Date | Date[] | number | null | undefined

export type RLCrudInputFieldType =
  | 'text'
  | 'checkbox'
  | 'select'
  | 'number'
  | 'date'
  | 'color'
  | 'image'
  | 'autocomplete'
  | 'dropdown'
  | 'textarea'

export interface RLCrudInputProps {
  className?: string
  inputName: string
  label: string
  type: RLCrudInputFieldType
  value?: RLCrudInputValueType
  onChange?: (value: RLCrudInputValueType) => void
  initialValue?: RLCrudInputValueType
  placeholder?: string
  options?: RLSelectOptionType[]
  rules?: RLInputRuleType[]
  disabled?: boolean
  required?: boolean
  imgStyle?: CSSProperties
  multiple?: boolean
  forceSelection?: boolean
  withTime?: boolean
  onError?: (error: RLFileInputErrorEvent) => void
}

export interface RLCrudInputRef {
  isValid: () => boolean
  validate: () => boolean
}
