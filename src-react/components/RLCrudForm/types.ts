import type { CSSProperties } from 'react'
import type { RLCrudInputFieldType, RLCrudInputValueType } from '../RLCrudInput'
import type { RLSelectOptionType } from '../RLSelect'
import type { RLInputRuleType } from '../utils/types'
import type { RLFileInputErrorEvent } from '../RLFileInput'

export interface RLCrudFormFieldType {
  i18n_key: string
  value: string
  input_type: RLCrudInputFieldType
  options?: RLSelectOptionType[]
  default_value?: RLCrudInputValueType
  class?: string
  label: string
  rules?: RLInputRuleType[]
  disabled?: boolean
  required?: boolean
  img_style?: CSSProperties
  hidden?: boolean
  hidden_on_create?: boolean
  disabled_on_edit?: boolean
  placeholder?: string
  multiple?: boolean
  forceSelection?: boolean
  withTime?: boolean
  side_effect?: (
    model: { [key: string]: RLCrudInputValueType },
    fields: {
      [key: string]: Omit<RLCrudFormFieldType, 'side_effect'>
    }
  ) => void
}

export interface RLCrudFormProps {
  value?: { [key: string]: RLCrudInputValueType }
  type: 'add' | 'edit'
  fields: RLCrudFormFieldType[]
  title: string
  cancelLabel: string
  confirmLabel: string
  requiredRuleMessage: string
  validateAll?: boolean
  primaryKey: string
  onClose?: () => void
  onCancel?: () => void
  onConfirm?: (data: { [key: string]: RLCrudInputValueType }) => void
  onError?: (error: RLFileInputErrorEvent) => void
}

export interface RLCrudFormRef {
  validate: () => boolean
}
