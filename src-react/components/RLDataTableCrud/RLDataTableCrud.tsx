import { forwardRef, useCallback } from 'react'
import { DataTable, DataTablePageEvent, DataTableSelectionMultipleChangeEvent, DataTableSelectionSingleChangeEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import type { RLDataTableCrudProps, RLColumn, RLAction } from './types'

export const RLDataTableCrud = forwardRef<DataTable<unknown[]>, RLDataTableCrudProps>(
  (
    {
      columns,
      actions = [],
      items,
      selection,
      onSelectionChange,
      size,
      stripedRows = false,
      removableSort = false,
      loading = false,
      lazy = false,
      defaultRows = 10,
      rowsPerPageOptions = [5, 10, 20],
      rowClass,
      rowStyle,
      totalRecords,
      paginator = true,
      paginatorPosition,
      paginatorTemplate,
      currentPageReportTemplate,
      actionHeaderLabel = 'Actions',
      selectionMode,
      selectionColumnProps,
      onPage,
      actionsSlot,
      emptySlot
    },
    ref
  ) => {
    const handleSelectionChange = useCallback(
      (e: DataTableSelectionMultipleChangeEvent<unknown[]> | DataTableSelectionSingleChangeEvent<unknown[]>) => {
        if (Array.isArray(e.value)) {
          onSelectionChange?.(e.value)
        } else if (e.value) {
          onSelectionChange?.([e.value])
        } else {
          onSelectionChange?.([])
        }
      },
      [onSelectionChange]
    )

    const handlePage = useCallback(
      (event: DataTablePageEvent) => {
        onPage?.(event)
      },
      [onPage]
    )

    const renderColumnBody = useCallback(
      (column: RLColumn) => {
        if (!column.component) return undefined

        return (data: unknown) => {
          const Component = column.component!
          return (
            <Component data={data} field={column.value} {...(column.componentProps || {})}>
              {column.value ? (data as Record<string, unknown>)[column.value] : null}
            </Component>
          )
        }
      },
      []
    )

    const renderActionBody = useCallback(
      (data: unknown) => (
        <div className="flex gap-2">
          {actionsSlot?.(data)}
          {actions.map((action: RLAction, index: number) => {
            const ActionComponent = action.component
            return (
              <ActionComponent
                key={action.name ?? index}
                data={data}
                {...(action.props || {})}
                onClick={() => action.onClick?.(data)}
              />
            )
          })}
        </div>
      ),
      [actions, actionsSlot]
    )

    return (
      <DataTable
        ref={ref}
        value={items}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        size={size}
        stripedRows={stripedRows}
        removableSort={removableSort}
        loading={loading}
        lazy={lazy}
        rows={defaultRows}
        rowsPerPageOptions={rowsPerPageOptions}
        rowClassName={rowClass}
        rowStyle={rowStyle}
        totalRecords={totalRecords ?? items.length}
        paginator={paginator}
        paginatorPosition={paginatorPosition}
        paginatorTemplate={paginatorTemplate}
        currentPageReportTemplate={currentPageReportTemplate}
        onPage={handlePage}
        emptyMessage={emptySlot}
        selectionMode={selectionMode as 'single' | 'multiple' | 'checkbox' | 'radiobutton' | null | undefined}
      >
        {selectionMode && (
          <Column
            selectionMode={selectionMode === 'single' || selectionMode === 'radiobutton' ? 'single' : 'multiple'}
            {...selectionColumnProps}
          />
        )}
        {columns.map((column) => (
          <Column
            key={column.value}
            field={column.value}
            sortable={column.sortable ?? false}
            header={column.name}
            body={column.component ? renderColumnBody(column) : undefined}
            {...(column.columnProps || {})}
          />
        ))}
        {(actions.length > 0 || actionsSlot) && (
          <Column header={actionHeaderLabel} body={renderActionBody} />
        )}
      </DataTable>
    )
  }
)

RLDataTableCrud.displayName = 'RLDataTableCrud'
