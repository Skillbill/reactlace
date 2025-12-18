import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { RLCrudInputProps, RLCrudInputRef } from './types'
import { RLInput, type RLInputRef } from '../RLInput'
import { RLTextArea, type RLTextAreaRef } from '../RLTextArea'
import { RLNumberInput, type RLNumberInputRef } from '../RLNumberInput'
import { RLCheckbox, type RLCheckboxRef } from '../RLCheckbox'
import { RLSelect, type RLSelectRef } from '../RLSelect'
import { RLColorPicker } from '../RLColorPicker'
import { RLImageUpload, type RLImageUploadRef } from '../RLImageUpload'
import { RLAutocomplete, type RLAutocompleteRef } from '../RLAutocomplete'
import { RLDropdown, type RLDropdownRef } from '../RLDropdown'
import { RLDatePicker, type RLDatePickerRef } from '../RLDatePicker'

type InputRefType =
  | RLInputRef
  | RLTextAreaRef
  | RLNumberInputRef
  | RLCheckboxRef
  | RLSelectRef
  | RLImageUploadRef
  | RLAutocompleteRef
  | RLDropdownRef
  | RLDatePickerRef
  | null

export const RLCrudInput = forwardRef<RLCrudInputRef, RLCrudInputProps>(
  (
    {
      inputName,
      label,
      type,
      value,
      onChange,
      placeholder,
      options = [],
      rules = [],
      disabled = false,
      required = false,
      imgStyle,
      multiple = false,
      forceSelection = true,
      withTime = false,
      onError
    },
    ref
  ) => {
    const inputRef = useRef<InputRefType>(null)

    useImperativeHandle(ref, () => ({
      isValid: () => inputRef.current?.isValid?.() ?? true,
      validate: () => inputRef.current?.validate?.() ?? true
    }))

    switch (type) {
      case 'text':
        return (
          <RLInput
            ref={inputRef as React.Ref<RLInputRef>}
            name={inputName}
            label={label}
            value={value as string}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            rules={rules}
            disabled={disabled}
            required={required}
          />
        )

      case 'textarea':
        return (
          <RLTextArea
            ref={inputRef as React.Ref<RLTextAreaRef>}
            name={inputName}
            label={label}
            value={value as string}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            rules={rules}
            disabled={disabled}
            required={required}
          />
        )

      case 'number':
        return (
          <RLNumberInput
            ref={inputRef as React.Ref<RLNumberInputRef>}
            name={inputName}
            label={label}
            value={value as number | null}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            rules={rules}
            disabled={disabled}
            required={required}
          />
        )

      case 'checkbox':
        return (
          <RLCheckbox
            ref={inputRef as React.Ref<RLCheckboxRef>}
            name={inputName}
            label={label}
            checked={value as boolean}
            onChange={(v) => onChange?.(v)}
            rules={rules}
            disabled={disabled}
            required={required}
          />
        )

      case 'select':
        return (
          <RLSelect
            ref={inputRef as React.Ref<RLSelectRef>}
            name={inputName}
            label={label}
            value={value as string | string[] | null}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            options={options}
            rules={rules}
            disabled={disabled}
            required={required}
            multiple={multiple}
          />
        )

      case 'color':
        return (
          <RLColorPicker
            name={inputName}
            label={label}
            value={value as string}
            onChange={(v) => onChange?.(v)}
            disabled={disabled}
            required={required}
          />
        )

      case 'image':
        return (
          <RLImageUpload
            ref={inputRef as React.Ref<RLImageUploadRef>}
            name={inputName}
            label={label}
            value={value as string | null}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            rules={rules}
            disabled={disabled}
            required={required}
            imgStyle={imgStyle}
            onError={onError}
          />
        )

      case 'autocomplete':
        return (
          <RLAutocomplete
            ref={inputRef as React.Ref<RLAutocompleteRef>}
            label={label}
            value={value as string}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            options={options}
            rules={rules}
            disabled={disabled}
            required={required}
            forceSelection={forceSelection}
          />
        )

      case 'dropdown':
        return (
          <RLDropdown
            ref={inputRef as React.Ref<RLDropdownRef>}
            name={inputName}
            label={label}
            value={value as string | string[] | null}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            options={options}
            rules={rules}
            disabled={disabled}
            required={required}
            multiple={multiple}
            dropdown
          />
        )

      case 'date':
        return (
          <RLDatePicker
            ref={inputRef as React.Ref<RLDatePickerRef>}
            name={inputName}
            label={label}
            value={value as Date | Date[] | null}
            onChange={(v) => onChange?.(v)}
            placeholder={placeholder}
            rules={rules}
            disabled={disabled}
            required={required}
            withTime={withTime}
          />
        )

      default:
        return null
    }
  }
)

RLCrudInput.displayName = 'RLCrudInput'
