import type { RLSelectOptionType } from '../RLSelect'
import type { RLInputRuleType, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from '../utils/types'

export interface RLAutocompleteProps {
  value?: string
  onChange?: (value: string) => void
  options?: RLSelectOptionType[]
  placeholder?: string
  disabled?: boolean
  forceSelection?: boolean
  emptySearchMessage?: string
  optionLabel?: string
  error?: string
  label?: string
  required?: boolean
  labelClassName?: string
  rules?: RLInputRuleType[]
  onClick?: (evt: Event) => void
  onBlur?: (evt: Event) => void
  onFocus?: (evt: Event) => void
  onSlChange?: (evt: AutoCompleteChangeEvent) => void
  onItemSelect?: (evt: { value: RLSelectOptionType }) => void
  onItemUnselect?: (evt: { value: RLSelectOptionType }) => void
  onDropdownClick?: (evt: Event) => void
  onComplete?: (evt: AutoCompleteCompleteEvent) => void
  onClear?: () => void
  onBeforeShow?: () => void
  onBeforeHide?: () => void
  onShow?: () => void
  onHide?: () => void
}

export interface RLAutocompleteRef {
  isValid: () => boolean
  validate: () => boolean
}
