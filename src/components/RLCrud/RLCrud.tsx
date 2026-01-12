import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type ComponentType } from 'react'
import type { RLCrudProps, RLCrudRef, RLCrudActionType } from './types'
import type { RLCrudFormFieldType } from '../RLCrudForm'
import type { RLCrudFiltersRef } from '../RLCrudFilters'
import type { RLCrudInputValueType } from '../RLCrudInput'
import { RLCrudAction } from '../RLCrudAction'
import { RLPaginator } from '../RLPaginator'
import { RLDialog } from '../RLDialog'
import { RLDataTableCrud } from '../RLDataTableCrud'
import { RLCrudFilters } from '../RLCrudFilters'
import { RLCrudForm } from '../RLCrudForm'
import { RLButton } from '../RLButton'

import './RLCrud.css'

export const RLCrud = forwardRef<RLCrudRef, RLCrudProps>(
  (
    {
      id,
      primary_key,
      singular_label,
      headers,
      filters: filtersConfig,
      filters_title,
      form_fields,
      actions,
      editable = true,
      showAddButton = true,
      components,
      actionHeaderI18nKey = 'header.actions',
      rowsPerPage: initialRowsPerPage = 10,
      rowsPerPageOptions = [5, 10, 25, 50],
      cancelI18nKey = 'button.cancel',
      addI18nKey = 'button.add',
      editI18nKey = 'button.edit',
      requiredI18nKey = 'error.required',
      applyI18nKey = 'button.apply',
      resetI18nKey = 'button.reset',
      addButtonI18nKey,
      addTitleI18nKey,
      editTitleI18nKey,
      editTooltipI18nKey = 'tooltip.edit',
      goToInsertedRow = false,
      highlightLastEdited = true,
      highlightLastEditedClass = '!bg-row-selected',
      persistActionDialog = true,
      rowClassName: externalRowClassName,
      getItems,
      addItem,
      editItem,
      translationFn = (key: string) => key,
      onFetchError,
      onError,
      actionsSlot,
      bottomContainerSlot
    },
    ref
  ) => {
    const [items, setItems] = useState<Record<string, unknown>[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(
      rowsPerPageOptions.includes(initialRowsPerPage)
        ? initialRowsPerPage
        : rowsPerPageOptions[0]
    )
    const [totalRows, setTotalRows] = useState(0)
    const [filtersApplied, setFiltersApplied] = useState<Record<string, unknown>>({})
    const [showDialog, setShowDialog] = useState(false)
    const [dialog, setDialog] = useState<string | null>(null)
    const [dialogProps, setDialogProps] = useState<Record<string, unknown>>({})
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
    const [lastSelectedItem, setLastSelectedItem] = useState<unknown>(null)
    const [fetchOnCloseStatus, setFetchOnCloseStatus] = useState(false)
    const skipWatchersRef = useRef(false)

    const filtersRef = useRef<RLCrudFiltersRef>(null)

    const filters = useMemo(
      () =>
        filtersConfig.map((filter) => ({
          ...filter,
          label: translationFn(filter.i18n_key)
        })),
      [filtersConfig, translationFn]
    )

    const columns = useMemo(
      () =>
        headers.map((header) => ({
          name: translationFn(header.i18n_key),
          value: header.value,
          sortable: header.sortable,
          ...(header.columnProps ? { columnProps: header.columnProps } : {}),
          ...(header.type
            ? {
                component: components?.[header.type] as ComponentType<{ data: unknown; field: string; [key: string]: unknown }>,
                componentProps: header.componentProps as Record<string, unknown>
              }
            : {})
        })),
      [headers, translationFn, components]
    )

    const formFields = useMemo(
      () =>
        form_fields.map((field) => ({
          ...field,
          label: translationFn(field.i18n_key)
        })) as RLCrudFormFieldType[],
      [form_fields, translationFn]
    )

    const fetchData = useCallback(async () => {
      try {
        const response = await getItems(currentPage, rowsPerPage, { ...filtersApplied })

        if (!response) {
          onFetchError?.()
          return
        }

        setItems(response.result as Record<string, unknown>[])
        setCurrentPage(response.page.currentPage)
        setTotalRows(response.page.totalRows)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        onFetchError?.()
      }
    }, [currentPage, rowsPerPage, filtersApplied, getItems, onFetchError])

    // Fetch data when pagination or filters change
    useEffect(() => {
      if (!skipWatchersRef.current) {
        fetchData()
      }
    }, [currentPage, rowsPerPage, filtersApplied]) // eslint-disable-line react-hooks/exhaustive-deps

    const onClickAction = useCallback(
      (action: RLCrudActionType) => (data: unknown) => {
        if (action.onClick) {
          const result = action.onClick(data)
          if (result instanceof Promise) {
            result.then((res) => {
              if (res === true) {
                fetchData()
              }
            })
          }
        }

        setLastSelectedItem((data as Record<string, unknown>)?.[primary_key])
        if (action.component) {
          setSelectedItem(structuredClone(data as Record<string, unknown>))
          setDialog(action.name)
          setDialogProps(action.dialogProperties ?? {})
          setShowDialog(true)
        }
      },
      [primary_key, fetchData]
    )

    const addItemHandler = useCallback(() => {
      setSelectedItem({})
      setDialog('add')
      setDialogProps({})
      setShowDialog(true)
    }, [])

    const onFiltersApplied = useCallback((appliedFilters: Record<string, unknown>) => {
      setFiltersApplied(appliedFilters)
      setCurrentPage(1)
    }, [])

    const onConfirm = useCallback(async () => {
      await fetchData()
    }, [fetchData])

    const rowClassName = useCallback(
      (row: unknown) => {
        const externalResult = externalRowClassName?.(row)
        const externalClasses = Array.isArray(externalResult)
          ? externalResult
          : externalResult
            ? [externalResult]
            : []

        if ((row as Record<string, unknown>)[primary_key] === lastSelectedItem && highlightLastEdited) {
          return [...externalClasses, highlightLastEditedClass].join(' ')
        }
        return externalClasses.join(' ')
      },
      [externalRowClassName, primary_key, lastSelectedItem, highlightLastEdited, highlightLastEditedClass]
    )

    const onAdd = useCallback(
      async (data: Record<string, unknown>) => {
        const response = await addItem?.(data)
        const responseRecord = response as Record<string, unknown>
        const newId =
          ((responseRecord?.result as Record<string, unknown>)?.[primary_key]) ??
          responseRecord?.[primary_key]
        setLastSelectedItem(newId)

        if (goToInsertedRow) {
          skipWatchersRef.current = true
          setFiltersApplied({ [primary_key]: newId as RLCrudInputValueType })
          filtersRef.current?.setFilterModel({ [primary_key]: newId as RLCrudInputValueType })
          filtersRef.current?.setOpen(true)
          setCurrentPage(1)
          await Promise.resolve() // Allow state to update
          skipWatchersRef.current = false
        }

        await onConfirm()
      },
      [addItem, primary_key, goToInsertedRow, onConfirm]
    )

    const editAction: RLCrudActionType = useMemo(
      () => ({
        name: 'edit',
        i18n_key: editTooltipI18nKey,
        icon_name: 'pencil',
        onClick: (data: unknown) => {
          setSelectedItem(structuredClone(data as Record<string, unknown>))
          setDialog('edit')
          setDialogProps({})
          setShowDialog(true)
        }
      }),
      [editTooltipI18nKey]
    )

    const onEdit = useCallback(
      async (data: Record<string, unknown>) => {
        await editItem?.(data)
        await onConfirm()
      },
      [editItem, onConfirm]
    )

    const closeDialog = useCallback(() => {
      setShowDialog(false)
      setDialogProps({})
      if (fetchOnCloseStatus) {
        setFetchOnCloseStatus(false)
        fetchData()
      }
      setTimeout(() => {
        setDialog(null)
      }, 300)
    }, [fetchOnCloseStatus, fetchData])

    const renderActions = useCallback(
      (data: unknown) => (
        <>
          {editable && (
            <RLCrudAction
              icon="pencil"
              tooltip={translationFn(editTooltipI18nKey)}
              onClick={() => onClickAction(editAction)(data)}
            />
          )}
          {actionsSlot?.(data)}
          {actions.map((action) =>
            (action.isVisible?.(data) ?? true) ? (
              <RLCrudAction
                key={action.name}
                tooltip={translationFn(action.i18n_key)}
                icon={action.icon_name}
                onClick={() => onClickAction(action)(data)}
              />
            ) : null
          )}
        </>
      ),
      [editable, translationFn, editTooltipI18nKey, onClickAction, editAction, actionsSlot, actions]
    )

    useImperativeHandle(ref, () => ({
      fetchData
    }))

    return (
      <div>
        <RLCrudFilters
          ref={filtersRef}
          className="w-full"
          title={filters_title ? translationFn(filters_title) : undefined}
          filters={filters}
          applyLabel={translationFn(applyI18nKey)}
          resetLabel={translationFn(resetI18nKey)}
          onFiltersApplied={onFiltersApplied}
          onError={onError}
        />

        <RLDataTableCrud
          className="w-full my-4"
          removableSort
          items={items}
          columns={columns}
          actions={[]}
          paginator={false}
          actionHeaderLabel={translationFn(actionHeaderI18nKey)}
          rowClassName={rowClassName}
          actionsSlot={renderActions}
          emptySlot={<div className="flex justify-center p-4">Empty</div>}
        />

        <div className="flex justify-between w-full">
          <div className="flex grow">
            {showAddButton && (
              <RLButton variant="primary" onClick={addItemHandler}>
                {translationFn(addButtonI18nKey ?? `button.add_${singular_label}`)}
              </RLButton>
            )}
            {bottomContainerSlot}
          </div>
          <RLPaginator
            page={currentPage}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            totalRows={totalRows}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </div>

        <RLDialog
          className="no-bottom-padding"
          noCloseOnOutsideClick={persistActionDialog}
          open={showDialog}
          onRequestClose={closeDialog}
          {...dialogProps}
        >
          {dialog === 'add' && (
            <RLCrudForm
              key="add"
              type="add"
              fields={formFields}
              title={translationFn(addTitleI18nKey ?? `message.add_${singular_label}`)}
              requiredRuleMessage={translationFn(requiredI18nKey)}
              cancelLabel={translationFn(cancelI18nKey)}
              confirmLabel={translationFn(addI18nKey)}
              primaryKey={primary_key}
              onClose={closeDialog}
              onCancel={closeDialog}
              onConfirm={onAdd}
              onError={onError}
            />
          )}

          {dialog === 'edit' && (
            <RLCrudForm
              key="edit"
              type="edit"
              fields={formFields}
              title={translationFn(editTitleI18nKey ?? `message.edit_${singular_label}`)}
              requiredRuleMessage={translationFn(requiredI18nKey)}
              cancelLabel={translationFn(cancelI18nKey)}
              confirmLabel={translationFn(editI18nKey)}
              value={(selectedItem as { [key: string]: RLCrudInputValueType }) ?? undefined}
              primaryKey={primary_key}
              onClose={closeDialog}
              onCancel={closeDialog}
              onConfirm={onEdit}
              onError={onError}
            />
          )}

          {actions
            .filter((action) => action.component)
            .map((action) => {
              if (action.name !== dialog) return null
              const ActionComponent = action.component!
              return (
                <ActionComponent
                  key={action.name}
                  data={{
                    id,
                    item: selectedItem,
                    primary_key,
                    ...(action.properties ?? {})
                  }}
                  onClose={closeDialog}
                  onConfirm={onConfirm}
                  onFetchOnClose={() => setFetchOnCloseStatus(true)}
                />
              )
            })}
        </RLDialog>
      </div>
    )
  }
)

RLCrud.displayName = 'RLCrud'
