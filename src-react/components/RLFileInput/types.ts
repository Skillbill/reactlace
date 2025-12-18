import type { ReactNode } from 'react'
import type { RLInputRuleType } from '../utils/types'

export interface RLFileInputErrorEvent {
  file?: string
  size?: number
  count?: number
  type?: string
  message: string
}

export interface RLFileInputProps {
  value?: File | File[] | null
  onChange?: (files: File | File[] | null) => void
  name?: string
  label: string
  placeholder?: string
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  accept?: string
  multiple?: boolean
  acceptedTypes?: string[] // MIME types
  maxFileSize?: number // bytes
  fileLimit?: number
  rules?: RLInputRuleType[]
  onError?: (error: RLFileInputErrorEvent) => void
  prefix?: ReactNode
  suffix?: ReactNode
}

export interface RLFileInputRef {
  isValid: () => boolean
  validate: () => boolean
}
