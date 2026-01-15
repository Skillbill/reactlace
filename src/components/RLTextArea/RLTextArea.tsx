import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import SlTextarea from '@shoelace-style/shoelace/dist/react/textarea/index.js'
import type SlTextareaElement from '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import type { RLTextAreaProps, RLTextAreaRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

export const RLTextArea = forwardRef<RLTextAreaRef, RLTextAreaProps>(
  (
    {
      className,
      value,
      onChange,
      name,
      defaultValue,
      size = 'medium',
      filled,
      label,
      helpText,
      rows = 4,
      resize = 'vertical',
      disabled,
      placeholder,
      readonly,
      form,
      required,
      autocapitalize = 'off',
      autocorrect,
      autofocus,
      spellcheck,
      inputmode = 'text',
      rules = [],
      error,
      onSlChange,
      onBlur,
      onFocus,
      onInput,
      onInvalid
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
        const target = event.target as SlTextareaElement
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

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    const combinedClassName = errorMessage ? 'error' : undefined

    return (
      <div className={`relative ${className ?? ''}`}>
        <SlTextarea
          className={combinedClassName}
          value={value ?? ''}
          name={name}
          defaultValue={defaultValue}
          size={size}
          filled={filled}
          label={label}
          helpText={helpText}
          rows={rows}
          resize={resize}
          disabled={disabled}
          placeholder={placeholder}
          readonly={readonly}
          form={form}
          required={required}
          autoCapitalize={autocapitalize}
          autoCorrect={autocorrect}
          autoFocus={autofocus}
          spellCheck={spellcheck}
          inputmode={inputmode}
          onSlChange={handleChange}
          onSlBlur={handleBlur}
          onSlFocus={handleFocus}
          onSlInput={handleInput}
          onSlInvalid={handleInvalid}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLTextArea.displayName = 'RLTextArea'
