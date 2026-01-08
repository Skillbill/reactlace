import { forwardRef, useImperativeHandle, useCallback, useEffect, useMemo } from 'react'
import type { RLSelectProps, RLSelectRef } from './types'
import type { SlChangeEvent } from '../utils/types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'
import { RLIcon } from '../RLIcon'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        value?: string | string[]
        defaultValue?: string | string[]
        size?: string
        multiple?: boolean
        placeholder?: string
        maxOptionsVisible?: number
        disabled?: boolean
        clearable?: boolean
        pill?: boolean
        filled?: boolean
        placement?: string
        helpText?: string
        label?: string
        required?: boolean
        form?: string
        hoist?: boolean
        class?: string
        getTag?: (option: { getTextLabel: () => string }) => string
      }
      'sl-option': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string
      }
    }
  }
}

export const RLSelect = forwardRef<RLSelectRef, RLSelectProps>(
  (
    {
      value,
      onChange,
      name,
      defaultValue,
      size = 'medium',
      multiple,
      placeholder,
      maxOptionsVisible = 3,
      disabled,
      clearable,
      pill,
      filled,
      placement = 'bottom',
      helpText,
      label,
      options = [],
      error,
      form,
      required,
      getTag,
      rules = [],
      onFocus,
      onBlur,
      onInput,
      onSlChange,
      onClear,
      onInvalid,
      onShow,
      onHide,
      onAfterShow,
      onAfterHide
    },
    ref
  ) => {
    const { errorMessage, isValid, validate } = useValidation({ rules, externalError: error })

    // Build dictionary for space handling
    const optionsDict = useMemo(() => {
      const dict: Record<string, string> = {}
      options.forEach(({ value: v }) => {
        dict[`${v}`.replaceAll(' ', '_')] = v
      })
      return dict
    }, [options])

    // Convert value for template (handle spaces)
    const templateValue = useMemo(() => {
      if (Array.isArray(value)) {
        return value.map((s) => `${s}`.replaceAll(' ', '_'))
      }
      return value ? `${value}`.replaceAll(' ', '_') : ''
    }, [value])

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
        const target = evt.target as HTMLSelectElement & { value: string | string[] }
        const rawValue = target?.value

        let newValue: string | string[] | null
        if (Array.isArray(rawValue)) {
          newValue = rawValue.map((v) => optionsDict[v] ?? v)
        } else if (rawValue) {
          newValue = optionsDict[rawValue] ?? rawValue
        } else {
          newValue = null
        }

        onChange?.(newValue)
        onSlChange?.(evt)
      },
      [optionsDict, onChange, onSlChange]
    )

    const handleClear = useCallback(
      (event: Event) => {
        onClear?.(event as unknown as Parameters<NonNullable<typeof onClear>>[0])
      },
      [onClear]
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

    const handleShow = useCallback(
      (event: Event) => {
        event.stopPropagation()
        onShow?.(event as unknown as Parameters<NonNullable<typeof onShow>>[0])
      },
      [onShow]
    )

    const handleHide = useCallback(
      (event: Event) => {
        event.stopPropagation()
        onHide?.(event as unknown as Parameters<NonNullable<typeof onHide>>[0])
      },
      [onHide]
    )

    const handleAfterShow = useCallback(
      (event: Event) => {
        event.stopPropagation()
        onAfterShow?.(event as unknown as Parameters<NonNullable<typeof onAfterShow>>[0])
      },
      [onAfterShow]
    )

    const handleAfterHide = useCallback(
      (event: Event) => {
        event.stopPropagation()
        onAfterHide?.(event as unknown as Parameters<NonNullable<typeof onAfterHide>>[0])
      },
      [onAfterHide]
    )

    const defaultGetTag = useCallback((option: { getTextLabel: () => string }) => {
      return `<sl-tag removable>${option.getTextLabel()}</sl-tag>`
    }, [])

    return (
      <div className="relative">
        <sl-select
          class={`min-w-full listbox ${errorMessage ? 'error' : ''}`}
          hoist
          value={templateValue}
          name={name || undefined}
          defaultValue={defaultValue || undefined}
          size={size}
          multiple={multiple || undefined}
          placeholder={placeholder || undefined}
          maxOptionsVisible={maxOptionsVisible}
          disabled={disabled || undefined}
          clearable={clearable || undefined}
          pill={pill || undefined}
          filled={filled || undefined}
          placement={placement}
          helpText={helpText || undefined}
          label={label || undefined}
          required={required || undefined}
          form={form}
          getTag={getTag || defaultGetTag}
          onsl-change={handleChange}
          onsl-clear={handleClear}
          onsl-blur={handleBlur}
          onsl-input={handleInput}
          onsl-focus={handleFocus}
          onsl-show={handleShow}
          onsl-after-show={handleAfterShow}
          onsl-hide={handleHide}
          onsl-after-hide={handleAfterHide}
          onsl-invalid={handleInvalid}
        >
          {options.map((option) => (
            <sl-option key={option.value} value={`${option.value}`.replaceAll(' ', '_')}>
              {option.icon && (
                <RLIcon name={option.icon} library={option.icon_library} slot="prefix" />
              )}
              {option.text}
            </sl-option>
          ))}
        </sl-select>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
    )
  }
)

RLSelect.displayName = 'RLSelect'
