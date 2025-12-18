import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import type { RLTextAreaProps, RLTextAreaRef } from './types'
import type { SlChangeEvent } from '../utils/types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-textarea': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        value?: string
        defaultValue?: string
        size?: string
        filled?: boolean
        label?: string
        'help-text'?: string
        rows?: number
        resize?: string
        disabled?: boolean
        placeholder?: string
        readonly?: boolean
        form?: string
        required?: boolean
        autocapitalize?: string
        autocorrect?: string
        autofocus?: boolean
        spellcheck?: boolean
        inputmode?: string
        class?: string
      }
    }
  }
}

export const RLTextArea = forwardRef<RLTextAreaRef, RLTextAreaProps>(
  (
    {
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
      (event: Event) => {
        const evt = event as unknown as SlChangeEvent
        const target = evt.target as HTMLTextAreaElement
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

    const handleInvalid = useCallback(
      (event: Event) => {
        onInvalid?.(event as unknown as Parameters<NonNullable<typeof onInvalid>>[0])
      },
      [onInvalid]
    )

    return (
      <div className="relative">
        <sl-textarea
          class={errorMessage ? 'error' : undefined}
          value={value}
          name={name || undefined}
          defaultValue={defaultValue || undefined}
          size={size}
          filled={filled || undefined}
          label={label || undefined}
          help-text={helpText || undefined}
          rows={rows}
          resize={resize}
          disabled={disabled || undefined}
          placeholder={placeholder || undefined}
          readonly={readonly || undefined}
          form={form}
          required={required || undefined}
          autocapitalize={autocapitalize}
          autocorrect={autocorrect}
          autofocus={autofocus || undefined}
          spellcheck={spellcheck}
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
