import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import type { RLInputProps, RLInputRef } from './types'
import type { SlChangeEvent } from '../utils/types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string
        name?: string
        value?: string
        defaultValue?: string
        size?: string
        filled?: boolean
        pill?: boolean
        label?: string
        'help-text'?: string
        clearable?: boolean
        disabled?: boolean
        placeholder?: string
        readonly?: boolean
        'password-toggle'?: boolean
        form?: string
        required?: boolean
        autocapitalize?: string
        autocomplete?: string
        autocorrect?: string
        autofocus?: boolean
        spellcheck?: boolean
        inputmode?: string
        min?: number
        max?: number
        step?: number | 'any'
        title?: string
        class?: string
      }
    }
  }
}

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
      form,
      required,
      autocapitalize = 'off',
      autocomplete,
      autocorrect,
      autofocus,
      spellcheck,
      inputmode = 'text',
      rules = [],
      error,
      title,
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
      (event: Event) => {
        const evt = event as unknown as SlChangeEvent
        const target = evt.target as HTMLInputElement
        const newValue = target?.value ?? ''
        onChange?.(newValue)
        onSlChange?.(evt)
      },
      [onChange, onSlChange]
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
        onClear?.(event as unknown as Parameters<NonNullable<typeof onClear>>[0])
      },
      [onClear]
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
          class={errorMessage ? 'error' : undefined}
          value={value}
          type={type}
          name={name || undefined}
          defaultValue={defaultValue || undefined}
          size={size}
          filled={filled || undefined}
          pill={pill || undefined}
          label={label || undefined}
          help-text={helpText || undefined}
          clearable={clearable || undefined}
          disabled={disabled || undefined}
          placeholder={placeholder || undefined}
          readonly={readonly || undefined}
          password-toggle={passwordToggle || undefined}
          form={form}
          required={required || undefined}
          autocapitalize={autocapitalize}
          autocomplete={autocomplete}
          autocorrect={autocorrect}
          autofocus={autofocus || undefined}
          spellcheck={spellcheck}
          inputmode={inputmode}
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

RLInput.displayName = 'RLInput'
