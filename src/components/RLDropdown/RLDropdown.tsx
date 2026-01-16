import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
  useEffect,
  useMemo,
  type KeyboardEvent,
  type ChangeEvent
} from 'react'
import type { RLDropdownProps, RLDropdownRef } from './types'
import type { RLSelectOptionType } from '../RLSelect'
import { ErrorMessage } from '../utils/ErrorMessage'
import { RLIcon } from '../RLIcon'
import { useValidation } from '../../hooks/useValidation'

export const RLDropdown = forwardRef<RLDropdownRef, RLDropdownProps>(
  (
    {
      className,
      value,
      onChange,
      name,
      label,
      placeholder = '',
      options = [],
      disabled = false,
      required = false,
      multiple = false,
      manual = false,
      dropdown = false,
      error,
      rules = []
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('')
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    // Sync selectedOptions with value
    useEffect(() => {
      if (Array.isArray(value)) {
        setSelectedOptions(value)
      } else if (value) {
        setSelectedOptions([value])
      } else {
        setSelectedOptions([])
      }
    }, [value])

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const optionsMap = useMemo(() => {
      const map = new Map<string, string>()
      for (const option of options) {
        map.set(option.value, option.text)
      }
      return map
    }, [options])

    const filteredOptions = useMemo(() => {
      if (!inputValue) return options
      return options.filter((option) =>
        option.text.toLowerCase().includes(inputValue.toLowerCase())
      )
    }, [inputValue, options])

    const closeDropdown = useCallback(() => {
      setDropdownVisible(false)
    }, [])

    const openDropdown = useCallback(() => {
      setDropdownVisible(true)
      setHighlightedIndex(-1)
    }, [])

    const toggleDropdown = useCallback(() => {
      if (!disabled) {
        setDropdownVisible((prev) => !prev)
      }
    }, [disabled])

    const selectOption = useCallback(
      (option: RLSelectOptionType) => {
        if (multiple) {
          const newSelected = selectedOptions.includes(option.value)
            ? selectedOptions
            : [...selectedOptions, option.value]
          setSelectedOptions(newSelected)
          onChange?.(newSelected)
        } else {
          setSelectedOptions([option.value])
          onChange?.(option.value)
        }
        setInputValue('')
        closeDropdown()
      },
      [multiple, selectedOptions, onChange, closeDropdown]
    )

    const removeOption = useCallback(
      (index: number) => {
        const newSelected = selectedOptions.filter((_, i) => i !== index)
        setSelectedOptions(newSelected)
        onChange?.(multiple ? newSelected : null)
      },
      [multiple, selectedOptions, onChange]
    )

    const handleInput = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        openDropdown()
        setHighlightedIndex(-1)
      },
      [openDropdown]
    )

    const handleEnter = useCallback(() => {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        selectOption(filteredOptions[highlightedIndex])
      } else if (manual && inputValue) {
        const newOption = { value: inputValue, text: inputValue }
        selectOption(newOption)
      }
      closeDropdown()
    }, [highlightedIndex, filteredOptions, manual, inputValue, selectOption, closeDropdown])

    const handleArrowDown = useCallback(() => {
      if (!dropdownVisible) return
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length)
    }, [dropdownVisible, filteredOptions.length])

    const handleArrowUp = useCallback(() => {
      if (!dropdownVisible) return
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
    }, [dropdownVisible, filteredOptions.length])

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'Enter':
            e.preventDefault()
            handleEnter()
            break
          case 'Escape':
            e.preventDefault()
            closeDropdown()
            break
          case 'Tab':
            closeDropdown()
            break
          case 'ArrowDown':
            e.preventDefault()
            handleArrowDown()
            break
          case 'ArrowUp':
            e.preventDefault()
            handleArrowUp()
            break
        }
      },
      [handleEnter, closeDropdown, handleArrowDown, handleArrowUp]
    )

    const inputLikeStyle = {
      display: 'flex',
      alignItems: 'center',
      minHeight: 'var(--sl-input-height-medium)',
      padding: '0.25rem 1rem',
      backgroundColor: disabled
        ? 'var(--sl-color-neutral-100)'
        : 'var(--sl-input-background-color)',
      border: `solid var(--sl-input-border-width) ${errorMessage ? 'var(--sl-color-danger-500)' : 'var(--sl-input-border-color)'}`,
      borderRadius: '0.25rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? 'var(--sl-color-neutral-400)' : undefined
    }

    return (
      <div className={`relative ${className ?? ''}`}>
        {label && (
          <label
            htmlFor={name}
            className={`pb-4 ${errorMessage ? 'error' : ''}`}
            style={errorMessage ? { color: 'var(--sl-color-danger-500)' } : undefined}
          >
            {label} {required && <span>*</span>}
          </label>
        )}
        <div
          className={`relative w-full rounded ${disabled ? 'disabled' : ''} ${errorMessage ? 'error' : ''}`}
          style={inputLikeStyle}
        >
          {!multiple && selectedOptions.length > 0 ? (
            <div className="flex grow">
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded">
                <span className="truncate">
                  {optionsMap.get(selectedOptions[0]) || selectedOptions[0]}
                </span>
                <RLIcon
                  className="text-[--sl-color-danger-600] cursor-pointer bg-none"
                  name="closeCircle"
                  onClick={() => removeOption(0)}
                />
              </div>
            </div>
          ) : (
            <input
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 bg-transparent border-none outline-none"
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onClick={() => dropdown && openDropdown()}
              onBlur={() => dropdownVisible && closeDropdown()}
            />
          )}
          {manual && inputValue && !filteredOptions.some((option) => option.text === inputValue) && (
            <RLIcon
              className="mr-2 text-lg text-[--sl-color-primary-700] cursor-pointer hover:opacity-70"
              name="plusCircle"
              onClick={handleEnter}
            />
          )}
          {dropdown && (
            <RLIcon
              className="text-lg text-gray-500 cursor-pointer hover:opacity-70"
              name={dropdownVisible ? 'chevronUp' : 'chevronDown'}
              onClick={toggleDropdown}
            />
          )}
          {filteredOptions.length > 0 && dropdownVisible && (
            <ul className="absolute left-0 right-0 z-10 overflow-y-auto bg-white border border-gray-300 rounded top-full max-h-48">
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`p-2 cursor-pointer ${
                    index === highlightedIndex
                      ? 'bg-[--sl-color-primary-700] text-[--sl-color-neutral-0] font-bold'
                      : ''
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectOption(option)}
                  onMouseOver={() => setHighlightedIndex(index)}
                >
                  {option.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {multiple && selectedOptions.length > 0 && (
          <div
            className={`flex flex-wrap max-w-full gap-2 mt-2 overflow-hidden ${errorMessage ? 'pt-4' : ''}`}
          >
            {selectedOptions.map((selectedValue, index) => (
              <div key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded">
                {optionsMap.get(selectedValue) || selectedValue}
                <RLIcon
                  className="ml-2 text-[--sl-color-danger-600] cursor-pointer bg-none"
                  name="closeCircle"
                  library="system"
                  onClick={() => removeOption(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

RLDropdown.displayName = 'RLDropdown'
