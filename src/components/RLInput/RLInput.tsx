import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import SlInput from '@shoelace-style/shoelace/dist/react/input/index.js'
import type SlInputElement from '@shoelace-style/shoelace/dist/components/input/input.js'
import type { RLInputProps, RLInputRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

export const RLInput = forwardRef<RLInputRef, RLInputProps>(
  (
    {
      value,
      onChange,
      type = 'text',
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
      passwordToggle,
      noSpinButtons,
      form,
      required,
      autocapitalize = 'off',
      autocomplete,
      autocorrect,
      autofocus,
      spellcheck,
      inputmode = 'text',
      min,
      max,
      step,
      rules = [],
      error,
      title,
      className,
      onClick,
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
        const target = event.target as SlInputElement
        const newValue = target?.value ?? ''
        validate(newValue)
        onChange?.(newValue)
        onSlChange?.(event)
      },
      [onChange, onSlChange, validate]
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
        onClear?.(event)
      },
      [onClear]
    )

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    const combinedClassName = [className, errorMessage ? 'error' : undefined]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="relative">
        <SlInput
          className={combinedClassName}
          value={value ?? ''}
          type={type}
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
          passwordToggle={passwordToggle}
          noSpinButtons={noSpinButtons}
          form={form}
          required={required}
          autoCapitalize={autocapitalize}
          autocomplete={autocomplete}
          autoCorrect={autocorrect}
          autoFocus={autofocus}
          spellCheck={spellcheck}
          inputmode={inputmode}
          min={min}
          max={max}
          step={step}
          title={title}
          onClick={onClick}
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

RLInput.displayName = 'RLInput'
