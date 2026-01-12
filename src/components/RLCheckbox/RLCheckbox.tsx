import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import type { RLCheckboxProps, RLCheckboxRef } from './types'
import type { SlInputEvent } from '../utils/types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        value?: boolean
        size?: string
        disabled?: boolean
        checked?: boolean
        indeterminate?: boolean
        defaultChecked?: boolean
        form?: string
        required?: boolean
        class?: string
        onSlInput?: (event: Event) => void
        onSlChange?: (event: Event) => void
        onSlBlur?: (event: Event) => void
        onSlFocus?: (event: Event) => void
        onSlInvalid?: (event: Event) => void
      }
    }
  }
}

export const RLCheckbox = forwardRef<RLCheckboxRef, RLCheckboxProps>(
  (
    {
      checked,
      onChange,
      name,
      size = 'medium',
      disabled,
      indeterminate,
      defaultChecked,
      form,
      required,
      label,
      error,
      rules = [],
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
      if (checked !== undefined) {
        validate(checked)
      }
    }, [checked, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(checked)
    }))

    const handleInput = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlInputEvent
        const target = evt.target as HTMLInputElement & { checked: boolean }
        onChange?.(target?.checked ?? false)
        onInput?.(evt)
      },
      [onChange, onInput]
    )

    const handleChange = useCallback(
      (event: Event) => {
        onSlChange?.(event as unknown as Parameters<NonNullable<typeof onSlChange>>[0])
      },
      [onSlChange]
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

    const handleInvalid = useCallback(
      (event: Event) => {
        onInvalid?.(event as unknown as Parameters<NonNullable<typeof onInvalid>>[0])
      },
      [onInvalid]
    )

    return (
      <div className="relative">
        <sl-checkbox
          class={`flex items-center ${errorMessage ? 'error' : ''}`}
          value={checked}
          name={name || undefined}
          size={size}
          disabled={disabled || undefined}
          checked={checked || undefined}
          indeterminate={indeterminate || undefined}
          defaultChecked={defaultChecked || undefined}
          form={form || undefined}
          required={required || undefined}
          onSlInput={handleInput}
          onSlChange={handleChange}
          onSlBlur={handleBlur}
          onSlFocus={handleFocus}
          onSlInvalid={handleInvalid}
        >
          {label && (
            <span style={errorMessage ? { color: 'var(--sl-color-danger-500)' } : undefined}>
              {label}
            </span>
          )}
        </sl-checkbox>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLCheckbox.displayName = 'RLCheckbox'
