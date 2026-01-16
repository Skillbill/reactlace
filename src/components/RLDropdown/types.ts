import type { RLInputRuleType } from '../utils/types'
import type { RLSelectOptionType } from '../RLSelect'

export interface RLDropdownProps {
  className?: string
  value?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
  name: string
  label: string
  placeholder?: string
  options?: RLSelectOptionType[]
  disabled?: boolean
  required?: boolean
  multiple?: boolean
  manual?: boolean
  dropdown?: boolean
  error?: string
  rules?: RLInputRuleType[]
}

export interface RLDropdownRef {
  isValid: () => boolean
  validate: () => boolean
}
