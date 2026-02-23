import type { RLInputRuleType } from '../utils/types'

export interface RLDatePickerProps {
  className?: string
  value?: Date | Date[] | string | null
  onChange?: (value: Date | Date[] | null) => void
  name?: string
  label: string
  defaultValue?: string
  format?: string
  placeholder?: string
  clearable?: boolean
  required?: boolean
  disabled?: boolean
  selectionMode?: 'single' | 'range' | 'multiple'
  minDate?: Date
  maxDate?: Date
  withTime?: boolean
  rules?: RLInputRuleType[]
  error?: string
}

export interface RLDatePickerRef {
  isValid: () => boolean
  validate: () => boolean
}
