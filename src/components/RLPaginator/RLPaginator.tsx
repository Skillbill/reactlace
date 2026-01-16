import { forwardRef, useCallback, useMemo, useEffect, useState } from 'react'
import type { RLPaginatorProps } from './types'
import { RLButton } from '../RLButton'
import { RLIcon } from '../RLIcon'
import { RLSelect } from '../RLSelect'

export const RLPaginator = forwardRef<HTMLDivElement, RLPaginatorProps>(
  (
    {
      className,
      page = 1,
      onPageChange,
      totalRows,
      rowsPerPage,
      onRowsPerPageChange,
      rowsPerPageOptions,
      onPaginationChange,
      children
    },
    ref
  ) => {
    const [rowsPerPageValue, setRowsPerPageValue] = useState<string>(
      `${rowsPerPage ?? rowsPerPageOptions[0]}`
    )

    const totalPages = useMemo(
      () => Math.ceil(totalRows / parseInt(rowsPerPageValue)),
      [totalRows, rowsPerPageValue]
    )

    const firstPage = useCallback(() => {
      if (page > 1) {
        onPageChange?.(1)
      }
    }, [page, onPageChange])

    const prevPage = useCallback(() => {
      if (page > 1) {
        onPageChange?.(page - 1)
      }
    }, [page, onPageChange])

    const nextPage = useCallback(() => {
      if (page < totalPages) {
        onPageChange?.(page + 1)
      }
    }, [page, totalPages, onPageChange])

    const lastPage = useCallback(() => {
      if (page < totalPages) {
        onPageChange?.(totalPages)
      }
    }, [page, totalPages, onPageChange])

    const handleRowsPerPageChange = useCallback(
      (value: string | string[] | null) => {
        if (value && typeof value === 'string') {
          setRowsPerPageValue(value)
          onPageChange?.(1)
          onRowsPerPageChange?.(parseInt(value))
        }
      },
      [onPageChange, onRowsPerPageChange]
    )

    useEffect(() => {
      onPaginationChange?.({ page, limit: parseInt(rowsPerPageValue) })
    }, [page, rowsPerPageValue, onPaginationChange])

    const selectOptions = useMemo(
      () => rowsPerPageOptions.map((item) => ({ value: `${item}`, text: `${item}` })),
      [rowsPerPageOptions]
    )

    return (
      <div ref={ref} className={`flex items-center gap-4 ${className ?? ''}`}>
        <RLButton onClick={firstPage} disabled={page === 1}>
          <RLIcon name="pageFirst" />
        </RLButton>
        <RLButton onClick={prevPage} disabled={page === 1}>
          <RLIcon name="chevronLeft" />
        </RLButton>
        {children ? (
          children({ page, totalPages })
        ) : (
          <span>
            {page}/{totalPages}
          </span>
        )}
        <RLButton onClick={nextPage} disabled={page === totalPages}>
          <RLIcon name="chevronRight" />
        </RLButton>
        <RLButton onClick={lastPage} disabled={page === totalPages}>
          <RLIcon name="pageLast" />
        </RLButton>
        <div className="w-24">
          <RLSelect
            value={rowsPerPageValue}
            onChange={handleRowsPerPageChange}
            options={selectOptions}
          />
        </div>
      </div>
    )
  }
)

RLPaginator.displayName = 'RLPaginator'
