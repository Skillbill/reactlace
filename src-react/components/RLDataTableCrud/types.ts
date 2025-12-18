import type { ReactNode, ComponentType, CSSProperties } from 'react'
import type { DataTablePageEvent } from 'primereact/datatable'
import type { ColumnProps } from 'primereact/column'

export interface RLColumn {
  name: string
  value: string
  sortable?: boolean
  component?: ComponentType<{ data: unknown; field: string; [key: string]: unknown }>
  columnProps?: Omit<ColumnProps, 'key' | 'field' | 'sortable' | 'header'>
  componentProps?: Record<string, unknown>
}

export interface RLAction {
  name?: string
  component: ComponentType<{ data: unknown; [key: string]: unknown }>
  props?: Record<string, unknown>
  onClick?: (data: unknown) => void
}

export interface RLDataTableCrudProps {
  columns: RLColumn[]
  actions?: RLAction[]
  items: unknown[]
  selection?: unknown[]
  onSelectionChange?: (selection: unknown[]) => void
  size?: 'small' | 'large'
  stripedRows?: boolean
  removableSort?: boolean
  loading?: boolean
  lazy?: boolean
  defaultRows?: number
  rowsPerPageOptions?: number[]
  rowClass?: (data: unknown) => string | object | (string | object)[] | undefined
  rowStyle?: (data: unknown) => CSSProperties | undefined
  totalRecords?: number
  paginator?: boolean
  paginatorPosition?: 'both' | 'top' | 'bottom'
  paginatorTemplate?: string
  currentPageReportTemplate?: string
  actionHeaderLabel?: string
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton'
  selectionColumnProps?: object
  onPage?: (event: DataTablePageEvent) => void
  actionsSlot?: (data: unknown) => ReactNode
  emptySlot?: ReactNode
}
