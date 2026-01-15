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
    const [inputModel, setInputModel] = useState<RLSelectOptionType | string | undefined>(undefined)
    const [suggestions, setSuggestions] = useState<RLSelectOptionType[]>(options)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    // Sync inputModel with value
    useEffect(() => {
      if (!value?.length) {
        setInputModel({ value: '', text: '' })
      } else {
        const found = options.find((option) => value === option.value)
        setInputModel(found ?? (!forceSelection ? { value, text: value } : undefined))
      }
    }, [value, options, forceSelection])

    useEffect(() => {
      setSuggestions(options)
    }, [options])

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const handleChange = (evt: { value: RLSelectOptionType | string | undefined }) => {
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
      setInputModel(evt.value)
      onChange?.(evt.value.value)
      onItemSelect?.(evt)
    }

    const handleClick = (evt: React.MouseEvent) => {
      setSuggestions(options)
      autocompleteRef.current?.show()
      onClick?.(evt.nativeEvent)
    }

    const handleFocus = (evt: React.FocusEvent) => {
      setSuggestions(options)
      autocompleteRef.current?.show()
      onFocus?.(evt.nativeEvent)
    }

    const handleBlur = (evt: React.FocusEvent) => {
      if (inputModel === null && value) {
          const selectedOption = options.find(
            (option) => option.value === value
          )
        if (selectedOption) {
            setInputModel(selectedOption)
          }
        }
      onBlur?.(evt.nativeEvent)
    }

    const handleComplete = (evt: AutoCompleteCompleteEvent) => {
      if (onComplete) {
        onComplete(evt)
      } else {
        const query = (evt.query ?? '').toString().toLowerCase()
        if (!query) {
          setSuggestions(options)
        } else {
          setSuggestions(options.filter((o) => (o.text ?? '')?.toString().toLowerCase().includes(query)))
        }
      }
    }

    const optionTemplate = (option: RLSelectOptionType) => {
      const selectedValue = (typeof inputModel === 'object') ? inputModel?.value : undefined
      
      return (
      <div className="flex items-center gap-2 min-h-[1lh]">
        <span className="w-4">
          {selectedValue === option.value && <RLIcon className="pt-1" name="check" />}
        </span>
        <span>{option.text}</span>
      </div>
    )}

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
          suggestions={suggestions}
          emptyMessage={emptySearchMessage}
          showEmptyMessage={true}
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
          onDropdownClick={(evt) => onDropdownClick?.(evt.originalEvent.nativeEvent)}
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
