import { forwardRef, useImperativeHandle, useCallback, useEffect, useMemo } from 'react'
import SlSelect from '@shoelace-style/shoelace/dist/react/select/index.js'
import SlOption from '@shoelace-style/shoelace/dist/react/option/index.js'
import type SlSelectElement from '@shoelace-style/shoelace/dist/components/select/select.js'
import type { RLSelectProps, RLSelectRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'
import { RLIcon } from '../RLIcon'

export const RLSelect = forwardRef<RLSelectRef, RLSelectProps>(
  (
    {
      value,
      onChange,
      name,
      defaultValue,
      size = 'medium',
      multiple,
      placeholder,
      maxOptionsVisible = 3,
      disabled,
      clearable,
      pill,
      filled,
      placement = 'bottom',
      helpText,
      label,
      options = [],
      error,
      form,
      required,
      getTag,
      rules = [],
      onFocus,
      onBlur,
      onInput,
      onSlChange,
      onClear,
      onInvalid,
      onShow,
      onHide,
      onAfterShow,
      onAfterHide
    },
    ref
  ) => {
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    // Build dictionary for space handling
    const optionsDict = useMemo(() => {
      const dict: Record<string, string> = {}
      options.forEach(({ value: v }) => {
        dict[`${v}`.replaceAll(' ', '_')] = v
      })
      return dict
    }, [options])

    // Convert value for template (handle spaces)
    const templateValue = useMemo(() => {
      if (Array.isArray(value)) {
        return value.map((s) => `${s}`.replaceAll(' ', '_'))
      }
      return value ? `${value}`.replaceAll(' ', '_') : ''
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

    const handleChange = useCallback(
      (event: CustomEvent) => {
        const target = event.target as SlSelectElement
        const rawValue = target?.value

        let newValue: string | string[] | null
        if (Array.isArray(rawValue)) {
          newValue = rawValue.map((v) => optionsDict[v] ?? v)
        } else if (rawValue) {
          newValue = optionsDict[rawValue] ?? rawValue
        } else {
          newValue = null
        }

        validate(newValue)
        onChange?.(newValue)
        onSlChange?.(event)
      },
      [optionsDict, onChange, onSlChange, validate]
    )

    const handleClear = useCallback(
      (event: CustomEvent) => {
        onClear?.(event)
      },
      [onClear]
    )

    const handleBlur = useCallback(
      (event: CustomEvent) => {
        onBlur?.(event)
      },
      [onBlur]
    )

    const handleFocus = useCallback(
      (event: CustomEvent) => {
        onFocus?.(event)
      },
      [onFocus]
    )

    const handleInput = useCallback(
      (event: CustomEvent) => {
        onInput?.(event)
      },
      [onInput]
    )

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    const handleShow = useCallback(
      (event: CustomEvent) => {
        event.stopPropagation()
        onShow?.(event)
      },
      [onShow]
    )

    const handleHide = useCallback(
      (event: CustomEvent) => {
        event.stopPropagation()
        onHide?.(event)
      },
      [onHide]
    )

    const handleAfterShow = useCallback(
      (event: CustomEvent) => {
        event.stopPropagation()
        onAfterShow?.(event)
      },
      [onAfterShow]
    )

    const handleAfterHide = useCallback(
      (event: CustomEvent) => {
        event.stopPropagation()
        onAfterHide?.(event)
      },
      [onAfterHide]
    )

    const defaultGetTag = useCallback((option: { getTextLabel: () => string }) => {
      return `<sl-tag removable>${option.getTextLabel()}</sl-tag>`
    }, [])

    const combinedClassName = `min-w-full listbox ${errorMessage ? 'error' : ''}`

    return (
      <div className="relative">
        <SlSelect
          className={combinedClassName}
          hoist
          value={templateValue}
          name={name}
          defaultValue={defaultValue}
          size={size}
          multiple={multiple}
          placeholder={placeholder}
          maxOptionsVisible={maxOptionsVisible}
          disabled={disabled}
          clearable={clearable}
          pill={pill}
          filled={filled}
          placement={placement}
          helpText={helpText}
          label={label}
          required={required}
          form={form}
          getTag={getTag || defaultGetTag}
          onSlChange={handleChange}
          onSlClear={handleClear}
          onSlBlur={handleBlur}
          onSlInput={handleInput}
          onSlFocus={handleFocus}
          onSlShow={handleShow}
          onSlAfterShow={handleAfterShow}
          onSlHide={handleHide}
          onSlAfterHide={handleAfterHide}
          onSlInvalid={handleInvalid}
        >
          {options.map((option) => (
            <SlOption key={option.value} value={`${option.value}`.replaceAll(' ', '_')}>
              {option.icon && (
                <RLIcon name={option.icon} library={option.icon_library} slot="prefix" />
              )}
              {option.text}
            </SlOption>
          ))}
        </SlSelect>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLSelect.displayName = 'RLSelect'
