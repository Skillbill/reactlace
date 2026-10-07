import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import { flushSync } from 'react-dom'
import SlInput from '@shoelace-style/shoelace/dist/react/input/index.js'
import type SlInputElement from '@shoelace-style/shoelace/dist/components/input/input.js'
import type { RLNumberInputProps, RLNumberInputRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'
import { useElementValue } from '../../hooks/useElementValue'

export const RLNumberInput = forwardRef<RLNumberInputRef, RLNumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      name,
      defaultValue,
      size = 'medium',
      filled,
      pill,
      label,
      helpText,
      clearable,
      disabled,
      placeholder,
      readonly,
      noSpinButtons,
      form,
      required,
      min,
      max,
      step = 1,
      autocomplete,
      autofocus,
      title,
      error,
      rules = [],
      onFocus,
      onBlur,
      onInput,
      onSlChange,
      onClear,
      onInvalid,
      children
    },
    ref
  ) => {
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })
    const { elementRef, commitValue } = useElementValue<SlInputElement>(value?.toString() ?? '')

    useEffect(() => {
      if (value !== undefined) {
        validate(value)
      }
    }, [value, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(value)
    }))

    const checkMinMax = useCallback(
      (inputValue: string): number | null => {
        const parsedValue = parseFloat(inputValue)

        if (Number.isNaN(parsedValue)) {
          return null
        }

        if (min !== undefined && parsedValue < min) {
          return min
        }
        if (max !== undefined && parsedValue > max) {
          return max
        }

        return parsedValue
      },
      [min, max]
    )

    const handleChange = useCallback(
      (event: CustomEvent) => {
        const target = event.target as SlInputElement
        const newValue = target?.value ?? ''
        const validValue = checkMinMax(newValue)
        commitValue(validValue?.toString() ?? '')
        // Render the parent before the event returns: Shoelace events are not
        // batched by React as its own, and a click on a button right after the
        // commit would run with a parent that still holds the old value
        flushSync(() => {
          validate(validValue)
          onChange?.(validValue)
        })
        onSlChange?.(event)
      },
      [checkMinMax, commitValue, onChange, onSlChange, validate]
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

    const handleClear = useCallback(
      (event: CustomEvent) => {
        onChange?.(null)
        onClear?.(event)
      },
      [onChange, onClear]
    )

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    return (
      <div className={`relative ${className ?? ''}`}>
        <SlInput
          ref={elementRef}
          className={errorMessage ? 'error' : undefined}
          type="number"
          name={name}
          defaultValue={defaultValue}
          size={size}
          filled={filled}
          pill={pill}
          label={label}
          helpText={helpText}
          clearable={clearable}
          disabled={disabled}
          placeholder={placeholder}
          readonly={readonly}
          noSpinButtons={noSpinButtons}
          form={form}
          required={required}
          min={min}
          max={max}
          step={step}
          autocomplete={autocomplete}
          autoFocus={autofocus}
          title={title}
          onSlChange={handleChange}
          onSlBlur={handleBlur}
          onSlFocus={handleFocus}
          onSlInput={handleInput}
          onSlClear={handleClear}
          onSlInvalid={handleInvalid}
        >
          {children}
        </SlInput>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLNumberInput.displayName = 'RLNumberInput'
