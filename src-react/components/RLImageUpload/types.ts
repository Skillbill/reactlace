import type { CSSProperties } from 'react'
import type { RLFileInputErrorEvent } from '../RLFileInput'
import type { RLInputRuleType } from '../utils/types'

export interface RLImageUploadProps {
  value?: string | null
  onChange?: (value: string | null) => void
  className?: string
  name?: string
  label: string
  placeholder?: string
  error?: string
  helpText?: string
  clearable?: boolean
  required?: boolean
  disabled?: boolean
  imgStyle?: CSSProperties
  rules?: RLInputRuleType[]
  onError?: (error: RLFileInputErrorEvent) => void
}

export interface RLImageUploadRef {
  isValid: () => boolean
  validate: () => boolean
}
