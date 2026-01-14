import { forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import SlRadioGroup from '@shoelace-style/shoelace/dist/react/radio-group/index.js'
import SlRadio from '@shoelace-style/shoelace/dist/react/radio/index.js'
import type SlRadioGroupElement from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js'
import type { RLRadioGroupProps, RLRadioGroupRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'

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
      (event: CustomEvent) => {
        const target = event.target as SlRadioGroupElement
        const newValue = target?.value ?? ''
        validate(newValue)
        onChange?.(newValue)
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

    const handleInvalid = useCallback(
      (event: CustomEvent) => {
        onInvalid?.(event)
      },
      [onInvalid]
    )

    const combinedClassName = errorMessage ? 'error' : undefined

    return (
      <div className="relative">
        <SlRadioGroup
          className={combinedClassName}
          value={value}
          label={label}
          helpText={helpText}
          name={name}
          size={size}
          form={form}
          required={required}
          onSlChange={handleChange}
          onSlInvalid={handleInvalid}
          onSlInput={handleInput}
        >
          {options.map((radio) => (
            <SlRadio
              key={radio.value}
              className={combinedClassName}
              value={radio.value}
              disabled={radio.disabled}
            >
              {radio.label}
            </SlRadio>
          ))}
          {children}
        </SlRadioGroup>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLRadioGroup.displayName = 'RLRadioGroup'
