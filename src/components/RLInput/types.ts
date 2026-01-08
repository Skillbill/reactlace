import type { ReactNode } from 'react'
import type {
  RLInputRuleType,
  SlBlurEvent,
  SlChangeEvent,
  SlClearEvent,
  SlFocusEvent,
  SlInputEvent,
  SlInvalidEvent
} from '../utils/types'

export interface RLInputProps {
  value?: string
  onChange?: (value: string) => void
  type?: 'password' | 'text' | 'email'
  name?: string
  defaultValue?: string
  size?: 'small' | 'medium' | 'large'
  filled?: boolean
  pill?: boolean
  label: string
  helpText?: string
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  readonly?: boolean
  passwordToggle?: boolean
  form?: string
  required?: boolean
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autocomplete?: string
  autocorrect?: 'off' | 'on'
  autofocus?: boolean
  spellcheck?: boolean
  inputmode?: 'none' | 'text' | 'email'
  rules?: RLInputRuleType[]
  error?: string
  title?: string
  onFocus?: (e: SlFocusEvent) => void
  onBlur?: (e: SlBlurEvent) => void
  onInput?: (e: SlInputEvent) => void
  onSlChange?: (e: SlChangeEvent) => void
  onClear?: (e: SlClearEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
  children?: ReactNode
}

export interface RLInputRef {
  isValid: () => boolean
  validate: () => boolean
}
