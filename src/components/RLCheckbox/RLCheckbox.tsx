import { forwardRef, useImperativeHandle, useCallback, useEffect, useRef } from 'react'
import SlCheckbox from '@shoelace-style/shoelace/dist/react/checkbox/index.js'
import type SlCheckboxElement from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import type { RLCheckboxProps, RLCheckboxRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

export const RLCheckbox = forwardRef<RLCheckboxRef, RLCheckboxProps>(
  (
    {
      className,
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
    const checkboxRef = useRef<SlCheckboxElement>(null)
    
    useEffect(() => {
      if (checkboxRef.current && checked !== undefined && checkboxRef.current.checked !== checked) {
        checkboxRef.current.checked = checked
      }
    }, [checked])

    useEffect(() => {
      if (checked !== undefined) {
        validate(checked)
      }
    }, [checked, validate])

    useImperativeHandle(ref, () => ({
      isValid: () => isValid,
      validate: () => validate(checked)
    }))

    const handleChange = useCallback(
      (event: CustomEvent) => {
        const target = event.target as SlCheckboxElement
        const newChecked = target?.checked ?? false
        validate(newChecked)
        onChange?.(newChecked)
        onSlChange?.(event)
      },
      [onChange, onSlChange, validate]
    )

    const handleInput = useCallback(
      (event: CustomEvent) => {
        onInput?.(event)
      },
      [onInput]
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

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    const combinedClassName = `flex items-center ${errorMessage ? 'error' : ''}`

    return (
      <div className={`relative ${className ?? ''}`}>
        <SlCheckbox
          ref={checkboxRef}
          className={combinedClassName}
          name={name}
          size={size}
          disabled={disabled}
          defaultChecked={checked ?? defaultChecked}
          indeterminate={indeterminate}
          form={form}
          required={required}
          onSlChange={handleChange}
          onSlInput={handleInput}
          onSlBlur={handleBlur}
          onSlFocus={handleFocus}
          onSlInvalid={handleInvalid}
        >
          {label && (
            <span style={errorMessage ? { color: 'var(--sl-color-danger-500)' } : undefined}>
              {label}
            </span>
          )}
        </SlCheckbox>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLCheckbox.displayName = 'RLCheckbox'
