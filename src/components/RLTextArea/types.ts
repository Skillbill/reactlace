import type {
  RLInputRuleType,
  SlChangeEvent,
  SlBlurEvent,
  SlFocusEvent,
  SlInputEvent,
  SlInvalidEvent
} from '../utils/types'

export interface RLTextAreaProps {
  className?: string
  value?: string
  onChange?: (value: string) => void
  name?: string
  defaultValue?: string
  size?: 'small' | 'medium' | 'large'
  filled?: boolean
  label: string
  helpText?: string
  rows?: number
  resize?: 'none' | 'vertical' | 'auto'
  disabled?: boolean
  placeholder?: string
  readonly?: boolean
  form?: string
  required?: boolean
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autocorrect?: 'off' | 'on'
  autofocus?: boolean
  spellcheck?: boolean
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  rules?: RLInputRuleType[]
  error?: string
  onSlChange?: (e: SlChangeEvent) => void
  onBlur?: (e: SlBlurEvent) => void
  onFocus?: (e: SlFocusEvent) => void
  onInput?: (e: SlInputEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
}

export interface RLTextAreaRef {
  isValid: () => boolean
  validate: () => boolean
}
