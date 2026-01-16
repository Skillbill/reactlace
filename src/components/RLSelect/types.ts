import type {
  RLInputRuleType,
  SlFocusEvent,
  SlBlurEvent,
  SlAfterHideEvent,
  SlInputEvent,
  SlShowEvent,
  SlHideEvent,
  SlInvalidEvent,
  SlChangeEvent,
  SlClearEvent,
  SlAfterShowEvent
} from '../utils/types'

export interface RLSelectOptionType {
  value: string
  text: string
  icon?: string
  icon_library?: string
}

export interface RLSelectProps {
  className?: string
  value?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
  name?: string
  defaultValue?: string | string[]
  size?: 'small' | 'medium' | 'large'
  multiple?: boolean
  placeholder?: string
  maxOptionsVisible?: number
  disabled?: boolean
  clearable?: boolean
  pill?: boolean
  filled?: boolean
  placement?: 'top' | 'bottom'
  hoist?: boolean
  helpText?: string
  label?: string
  options: RLSelectOptionType[]
  error?: string
  form?: string
  required?: boolean
  getTag?: (option: { getTextLabel: () => string }) => string
  rules?: RLInputRuleType[]
  onFocus?: (e: SlFocusEvent) => void
  onBlur?: (e: SlBlurEvent) => void
  onInput?: (e: SlInputEvent) => void
  onSlChange?: (e: SlChangeEvent) => void
  onClear?: (e: SlClearEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
  onShow?: (e: SlShowEvent) => void
  onHide?: (e: SlHideEvent) => void
  onAfterShow?: (e: SlAfterShowEvent) => void
  onAfterHide?: (e: SlAfterHideEvent) => void
}

export interface RLSelectRef {
  isValid: () => boolean
  validate: () => boolean
}
