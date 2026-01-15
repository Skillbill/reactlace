import type {
  RLInputRuleType,
  SlChangeEvent,
  SlBlurEvent,
  SlFocusEvent,
  SlInputEvent,
  SlInvalidEvent
} from '../utils/types'

export interface RLCheckboxProps {
  className?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  indeterminate?: boolean
  defaultChecked?: boolean
  form?: string
  required?: boolean
  label?: string
  error?: string
  rules?: RLInputRuleType[]
  onSlChange?: (e: SlChangeEvent) => void
  onBlur?: (e: SlBlurEvent) => void
  onFocus?: (e: SlFocusEvent) => void
  onInput?: (e: SlInputEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
}

export interface RLCheckboxRef {
  isValid: () => boolean
  validate: () => boolean
}
