import type { ReactNode } from 'react'

export interface RLPaginatorProps {
  page?: number
  onPageChange?: (page: number) => void
  totalRows: number
  rowsPerPage?: number
  onRowsPerPageChange?: (rowsPerPage: number) => void
  rowsPerPageOptions: number[]
  onPaginationChange?: (pagination: { page: number; limit: number }) => void
  children?: (props: { page: number; totalPages: number }) => ReactNode
}
