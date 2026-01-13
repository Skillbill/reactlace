import type { RLFileInputErrorEvent } from '../RLFileInput'
import type { RLCrudInputFieldType, RLCrudInputValueType } from '../RLCrudInput'
import type { RLSelectOptionType } from '../RLSelect'

export interface RLCrudFilterType {
  value: string
  i18n_key: string
  label: string
  input_type: RLCrudInputFieldType
  options?: RLSelectOptionType[]
  default_value?: RLCrudInputValueType
  class?: string
}

export interface RLCrudFiltersProps {
  title?: string
  filters: RLCrudFilterType[]
  applyLabel?: string
  resetLabel?: string
  className?: string
  onApply?: () => void
  onHide?: () => void
  onReset?: () => void
  onShow?: () => void
  onFiltersApplied?: (filters: { [key: string]: RLCrudInputValueType }) => void
  onError?: (error: RLFileInputErrorEvent) => void
  titleSlot?: React.ReactNode
  applySlot?: React.ReactNode
  resetSlot?: React.ReactNode
}

export interface RLCrudFiltersRef {
  setFilterModel: (filters: { [key: string]: RLCrudInputValueType }) => void
  setOpen: (open: boolean) => void
}
