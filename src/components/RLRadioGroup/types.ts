import type { ReactNode } from 'react'
import type { RLInputRuleType, SlChangeEvent, SlInputEvent, SlInvalidEvent } from '../utils/types'

export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface RLRadioGroupProps {
  className?: string
  value?: string
  onChange?: (value: string) => void
  label?: string
  helpText?: string
  name?: string
  size?: 'small' | 'medium' | 'large'
  form?: string
  required?: boolean
  options: RadioOption[]
  error?: string
  rules?: RLInputRuleType[]
  onSlChange?: (e: SlChangeEvent) => void
  onInput?: (e: SlInputEvent) => void
  onInvalid?: (e: SlInvalidEvent) => void
  children?: ReactNode
}

export interface RLRadioGroupRef {
  isValid: () => boolean
  validate: () => boolean
}
