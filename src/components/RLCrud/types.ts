import type { ComponentType } from 'react'
import type { ColumnProps } from 'primereact/column'
import type { RLDialogProps } from '../RLDialog'
import type { RLCrudFilterType } from '../RLCrudFilters'
import type { RLFileInputErrorEvent } from '../RLFileInput'
import type { RLCrudFormFieldType } from '../RLCrudForm'

export interface RLCrudHeaderType {
  i18n_key: string
  value: string
  sortable?: boolean
  type?: string
  componentProps?: object
  columnProps?: Omit<ColumnProps, 'key' | 'field' | 'sortable' | 'header'>
}

export interface RLCrudActionType {
  name: string
  i18n_key: string
  icon_name: string
  component?: ComponentType<{
    data: {
      id: string
      item: unknown
      primary_key: string
      [key: string]: unknown
    }
    onClose?: () => void
    onConfirm?: () => void
    onFetchOnClose?: () => void
  }>
  onClick?: (data: unknown) => void | Promise<boolean>
  isVisible?: (data: unknown) => boolean
  properties?: object
  dialogProperties?: Omit<RLDialogProps, 'open' | 'onRequestClose'>
}

export interface RLCrudProps {
  id: string
  primary_key: string
  singular_label: string
  headers: RLCrudHeaderType[]
  filters: Omit<RLCrudFilterType, 'label'>[]
  filters_title?: string
  form_fields: Omit<RLCrudFormFieldType, 'label'>[]
  actions: RLCrudActionType[]
  editable?: boolean
  showAddButton?: boolean
  components?: { [key: string]: ComponentType<unknown> }
  actionHeaderI18nKey?: string
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  cancelI18nKey?: string
  addI18nKey?: string
  editI18nKey?: string
  requiredI18nKey?: string
  applyI18nKey?: string
  resetI18nKey?: string
  addButtonI18nKey?: string
  addTitleI18nKey?: string
  editTitleI18nKey?: string
  editTooltipI18nKey?: string
  goToInsertedRow?: boolean
  highlightLastEdited?: boolean
  highlightLastEditedClass?: string
  persistActionDialog?: boolean
  rowClassName?: (data: unknown) => string | string[] | undefined
  getItems: (
    page: number,
    rowsPerPage: number,
    filters: unknown
  ) => Promise<
    | {
        result: unknown[]
        page: {
          currentPage: number
          pageRows: number
          totalRows: number
        }
      }
    | undefined
  >
  addItem?: (item: unknown) => Promise<unknown>
  editItem?: (item: unknown) => Promise<unknown>
  translationFn?: (key: string, props?: { [key: string]: unknown }) => string
  onFetchError?: () => void
  onError?: (error: RLFileInputErrorEvent) => void
  actionsSlot?: (data: unknown) => React.ReactNode
  bottomContainerSlot?: React.ReactNode
}

export interface RLCrudRef {
  fetchData: () => Promise<void>
}
