import { forwardRef, useImperativeHandle, useCallback, useEffect, useRef } from 'react'
import type { RLNumberInputProps, RLNumberInputRef } from './types'
import type { SlChangeEvent } from '../utils/types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

export const RLNumberInput = forwardRef<RLNumberInputRef, RLNumberInputProps>(
  (
    {
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
    const inputRef = useRef<HTMLElement>(null)
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

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
      (event: Event) => {
        const evt = event as unknown as SlChangeEvent
        const target = evt.target as HTMLInputElement
        const validValue = checkMinMax(target?.value ?? '')
        onChange?.(validValue)
        onSlChange?.(evt)

        // Update input display if value was clamped
        if (inputRef.current && validValue !== null) {
          ;(inputRef.current as unknown as HTMLInputElement).value = validValue.toString()
        }
      },
      [checkMinMax, onChange, onSlChange]
    )

    const handleBlur = useCallback(
      (event: Event) => {
        onBlur?.(event as unknown as Parameters<NonNullable<typeof onBlur>>[0])
      },
      [onBlur]
    )

    const handleFocus = useCallback(
      (event: Event) => {
        onFocus?.(event as unknown as Parameters<NonNullable<typeof onFocus>>[0])
      },
      [onFocus]
    )

    const handleInput = useCallback(
      (event: Event) => {
        onInput?.(event as unknown as Parameters<NonNullable<typeof onInput>>[0])
      },
      [onInput]
    )

    const handleClear = useCallback(
      (event: Event) => {
        onChange?.(null)
        onClear?.(event as unknown as Parameters<NonNullable<typeof onClear>>[0])
      },
      [onChange, onClear]
    )

    const handleInvalid = useCallback(
      (event: Event) => {
        onInvalid?.(event as unknown as Parameters<NonNullable<typeof onInvalid>>[0])
      },
      [onInvalid]
    )

    return (
      <div className="relative">
        <sl-input
          ref={inputRef}
          class={errorMessage ? 'error' : undefined}
          type="number"
          value={value?.toString() ?? ''}
          name={name || undefined}
          defaultValue={defaultValue}
          size={size}
          filled={filled || undefined}
          pill={pill || undefined}
          label={label || undefined}
          help-text={helpText || undefined}
          clearable={clearable || undefined}
          disabled={disabled || undefined}
          placeholder={placeholder || undefined}
          readonly={readonly || undefined}
          no-spin-buttons={noSpinButtons || undefined}
          form={form}
          required={required || undefined}
          min={min}
          max={max}
          step={step}
          autocomplete={autocomplete}
          autofocus={autofocus || undefined}
          title={title}
          onsl-change={handleChange}
          onsl-blur={handleBlur}
          onsl-focus={handleFocus}
          onsl-input={handleInput}
          onsl-clear={handleClear}
          onsl-invalid={handleInvalid}
        >
          {children}
        </sl-input>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLNumberInput.displayName = 'RLNumberInput'
