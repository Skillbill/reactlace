import type { ReactNode } from 'react'
import type {
  RLInputRuleType,
  SlFocusEvent,
  SlBlurEvent,
  SlInputEvent,
  SlChangeEvent,
  SlInvalidEvent,
  SlClearEvent
} from '../utils/types'

export interface RLNumberInputProps {
  className?: string
  value?: number | null
  onChange?: (value: number | null) => void
  name?: string
  defaultValue?: string
  size?: 'small' | 'medium' | 'large'
  filled?: boolean
  pill?: boolean
  label?: string
  helpText?: string
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  readonly?: boolean
  noSpinButtons?: boolean
  form?: string
  required?: boolean
  min?: number
  max?: number
  step?: number | 'any'
  autocomplete?: string
  autofocus?: boolean
  title?: string
  error?: string
  rules?: RLInputRuleType[]
  onFocus?: (e: SlFocusEvent) => void
  onBlur?: (e: SlBlurEvent) => void
  onInput?: (e: SlInputEvent) => void
  onSlChange?: (e: SlChangeEvent) => void
  onClear?: (e: SlClearEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
  children?: ReactNode
}

export interface RLNumberInputRef {
  isValid: () => boolean
  validate: () => boolean
}
