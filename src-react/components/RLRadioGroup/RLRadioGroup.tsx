import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import type { RLRadioGroupProps, RLRadioGroupRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-radio-group': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string
        label?: string
        helpText?: string
        name?: string
        size?: string
        form?: string
        required?: boolean
        class?: string
      }
      'sl-radio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string
        disabled?: boolean
        class?: string
      }
    }
  }
}

export const RLRadioGroup = forwardRef<RLRadioGroupRef, RLRadioGroupProps>(
  (
    {
      value,
      onChange,
      label,
      helpText,
      name,
      size = 'medium',
      form,
      required,
      options,
      error,
      rules = [],
      onSlChange,
      onInput,
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
        const target = event.target as HTMLInputElement
        onChange?.(target?.value ?? '')
        onSlChange?.(event as unknown as Parameters<NonNullable<typeof onSlChange>>[0])
      },
      [onChange, onSlChange]
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
        <sl-radio-group
          class={errorMessage ? 'error' : undefined}
          value={value}
          label={label || undefined}
          helpText={helpText || undefined}
          name={name || undefined}
          size={size}
          form={form || undefined}
          required={required || undefined}
          onSlChange={handleChange}
          onSlInvalid={handleInvalid}
          onSlInput={handleInput}
        >
          {options.map((radio) => (
            <sl-radio
              key={radio.value}
              class={errorMessage ? 'error' : undefined}
              value={radio.value}
              disabled={radio.disabled || undefined}
            >
              {radio.label}
            </sl-radio>
          ))}
          {children}
        </sl-radio-group>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLRadioGroup.displayName = 'RLRadioGroup'
