import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import type { RLAutocompleteProps, RLAutocompleteRef } from './types'
import type { RLSelectOptionType } from '../RLSelect'
import { ErrorMessage } from '../utils/ErrorMessage'
import { RLIcon } from '../RLIcon'
import { useValidation } from '../../hooks/useValidation'

export const RLAutocomplete = forwardRef<RLAutocompleteRef, RLAutocompleteProps>(
  (
    {
      value,
      onChange,
      options = [],
      placeholder,
      disabled = false,
      forceSelection = true,
      emptySearchMessage,
      error,
      label,
      required = false,
      labelClassName,
      rules = [],
      onClick,
      onBlur,
      onFocus,
      onSlChange,
      onItemSelect,
      onItemUnselect,
      onDropdownClick,
      onComplete,
      onClear,
      onShow,
      onHide
    },
    ref
  ) => {
    const autocompleteRef = useRef<AutoComplete>(null)
    const [inputModel, setInputModel] = useState<RLSelectOptionType | string | null>(null)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    // Sync inputModel with value
    useEffect(() => {
      if (!value?.length) {
        setInputModel({ value: '', text: '' })
      } else {
        const found = options.find((option) => value === option.value)
        setInputModel(found ?? (!forceSelection ? { value, text: value } : null))
      }
    }, [value, options, forceSelection])

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const handleChange = (evt: { value: RLSelectOptionType | string | null }) => {
      console.log('handleChange evt.value:', evt.value)

      setInputModel(evt.value)

      if (!forceSelection) {
        if (evt.value && typeof evt.value === 'object') {
          onChange?.(evt.value.value)
        } else if (typeof evt.value === 'string') {
          onChange?.(evt.value)
        } else {
          onChange?.('')
        }
      }

      onSlChange?.(evt as Parameters<NonNullable<typeof onSlChange>>[0])
    }

    const handleItemSelect = (evt: { value: RLSelectOptionType }) => {
      console.log('handleItemSelect evt.value:', evt.value)

      setInputModel(evt.value)
      onChange?.(evt.value.value)
      onItemSelect?.(evt)
    }

    const handleClick = (evt: React.MouseEvent) => {
      autocompleteRef.current?.show()
      onClick?.(evt.nativeEvent)
    }

    const handleFocus = (evt: React.FocusEvent) => {
      autocompleteRef.current?.show()
      onFocus?.(evt.nativeEvent)
    }

    const handleBlur = (evt: React.FocusEvent) => {
      onBlur?.(evt.nativeEvent)
    }

    const handleComplete = (evt: AutoCompleteCompleteEvent) => {
      if (onComplete) {
        onComplete(evt)
      }
    }

    const optionTemplate = (option: RLSelectOptionType) => (
      <div className="flex items-center gap-2 min-h-[1lh]">
        <span className="w-4">
          {value === option.value && <RLIcon className="pt-1" name="check" />}
        </span>
        <span>{option.text}</span>
      </div>
    )

    return (
      <div className="relative">
        <label
          className={`block mb-[2px] ${errorMessage ? 'error' : ''} ${labelClassName || ''}`}
          style={errorMessage ? { color: 'var(--sl-color-danger-500)' } : undefined}
        >
          {label} {required && <span>*</span>}
        </label>
        <AutoComplete
          ref={autocompleteRef}
          className={errorMessage ? 'error' : ''}
          value={inputModel}
          field="text"
          suggestions={options}
          emptyMessage={emptySearchMessage}
          placeholder={placeholder}
          disabled={disabled}
          forceSelection={forceSelection}
          inputClassName="px-4 py-1"
          panelClassName="py-2"
          dropdown
          onChange={handleChange}
          onSelect={handleItemSelect}
          onUnselect={(evt) => onItemUnselect?.(evt as { value: RLSelectOptionType })}
          onBlur={handleBlur}
          completeMethod={handleComplete}
          onClick={handleClick}
          onFocus={handleFocus}
          onDropdownClick={(evt) => onDropdownClick?.(evt.originalEvent)}
          onClear={onClear}
          onShow={onShow}
          onHide={onHide}
          itemTemplate={optionTemplate}
          dropdownIcon={() => <RLIcon className="dropdown" name="caret" library="system" />}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLAutocomplete.displayName = 'RLAutocomplete'
