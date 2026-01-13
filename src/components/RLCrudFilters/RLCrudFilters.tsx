import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { RLCrudFiltersProps, RLCrudFiltersRef } from './types'
import type { RLCrudInputValueType } from '../RLCrudInput'
import { RLCrudInput } from '../RLCrudInput'
import { RLButton } from '../RLButton'
import { RLExpansionCard, type RLExpansionCardRef } from '../RLExpansionCard'

export const RLCrudFilters = forwardRef<RLCrudFiltersRef, RLCrudFiltersProps>(
  (
    {
      title = 'Filters',
      filters,
      applyLabel = 'apply',
      resetLabel = 'reset',
      className,
      onApply,
      onHide,
      onReset,
      onShow,
      onFiltersApplied,
      onError,
      titleSlot,
      applySlot,
      resetSlot
    },
    ref
  ) => {
    const [model, setModel] = useState<{ [key: string]: RLCrudInputValueType }>({})
    const currentFiltersStatusRef = useRef<{ [key: string]: RLCrudInputValueType }>({})
    const expansionCardRef = useRef<RLExpansionCardRef>(null)

    const resetFields = useCallback(() => {
      const defaultFilters =
        filters?.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.value]: curr.default_value
          }),
          {}
        ) ?? {}

      currentFiltersStatusRef.current = defaultFilters
      setModel({ ...defaultFilters })
      return defaultFilters
    }, [filters])

    // Initialize on mount
    useEffect(() => {
      const initialFilters = resetFields()
      onFiltersApplied?.(initialFilters)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleApply = useCallback(() => {
      currentFiltersStatusRef.current = { ...model }
      onFiltersApplied?.(currentFiltersStatusRef.current)
      onApply?.()
    }, [model, onFiltersApplied, onApply])

    const handleReset = useCallback(() => {
      const defaultFilters = resetFields()
      onFiltersApplied?.(defaultFilters)
      onReset?.()
    }, [resetFields, onFiltersApplied, onReset])

    const handleShow = useCallback(() => {
      setModel({ ...currentFiltersStatusRef.current })
      onShow?.()
    }, [onShow])

    const handleHide = useCallback(() => {
      setModel({ ...currentFiltersStatusRef.current })
      onHide?.()
    }, [onHide])

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleApply()
        }
      },
      [handleApply]
    )

    const handleFieldChange = useCallback(
      (fieldKey: string, value: RLCrudInputValueType) => {
        setModel((prev) => ({ ...prev, [fieldKey]: value }))
      },
      []
    )

    useImperativeHandle(ref, () => ({
      setFilterModel: (newFilters: { [key: string]: RLCrudInputValueType }) => {
        currentFiltersStatusRef.current = { ...newFilters }
        setModel({ ...newFilters })
      },
      setOpen: (open: boolean) => {
        if (open) {
          expansionCardRef.current?.show()
        } else {
          expansionCardRef.current?.hide()
        }
      }
    }))

    return (
      <RLExpansionCard
        ref={expansionCardRef}
        title={title}
        className={className}
        onHide={handleHide}
        onShow={handleShow}
        onKeyUp={handleKeyUp}
        titleSlot={titleSlot}
      >
        <div className="flex flex-col justify-between gap-4">
          <div className="grid flex-wrap items-center grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filters.map((field) => (
              <RLCrudInput
                key={field.value}
                inputName={field.value}
                type={field.input_type}
                label={field.label}
                options={field.options}
                value={model[field.value]}
                onChange={(v) => handleFieldChange(field.value, v)}
                onError={onError}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <RLButton onClick={handleReset}>
              {resetSlot ?? resetLabel}
            </RLButton>
            <RLButton onClick={handleApply} variant="primary">
              {applySlot ?? applyLabel}
            </RLButton>
          </div>
        </div>
      </RLExpansionCard>
    )
  }
)

RLCrudFilters.displayName = 'RLCrudFilters'
