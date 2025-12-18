import { forwardRef, useImperativeHandle, useCallback, useState, useMemo, useEffect } from 'react'
import { Calendar } from 'primereact/calendar'
import type { RLDatePickerProps, RLDatePickerRef } from './types'
import { ErrorMessage } from '../utils/ErrorMessage'
import { useValidation } from '../../hooks/useValidation'
import { RLIcon } from '../RLIcon'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-icon-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        library?: string
        name?: string
      }
    }
  }
}

export const RLDatePicker = forwardRef<RLDatePickerRef, RLDatePickerProps>(
  (
    {
      value,
      onChange,
      name,
      label,
      placeholder,
      clearable = true,
      required,
      disabled,
      selectionMode = 'single',
      minDate,
      maxDate,
      withTime,
      rules = [],
      error
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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

    const formatDate = useCallback(
      (date: Date): string => {
        let formattedDate = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`

        if (withTime) {
          formattedDate += ` ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
        }

        return formattedDate
      },
      [withTime]
    )

    const formattedValue = useMemo((): string | undefined => {
      if (!value) return undefined

      if (Array.isArray(value)) {
        if (selectionMode === 'range') {
          const [startDate, endDate] = value
          const formattedStartDate = formatDate(startDate)
          const formattedEndDate = endDate ? formatDate(endDate) : ''
          return `${formattedStartDate} ~ ${formattedEndDate}`
        } else if (selectionMode === 'multiple') {
          return value.map((date) => formatDate(date)).join(', ')
        }
      }

      if (value instanceof Date) {
        return formatDate(value)
      }

      return ''
    }, [value, selectionMode, formatDate])

    const handleDateSelect = useCallback(
      (date: Date | Date[] | null) => {
        if (selectionMode === 'single') {
          setIsDropdownOpen(false)
        }
        onChange?.(date)
      },
      [selectionMode, onChange]
    )

    const handleClear = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation()
        onChange?.(null)
      },
      [onChange]
    )

    const handleInputClick = useCallback(
      (event: React.MouseEvent) => {
        if (disabled) {
          event.stopPropagation()
        }
      },
      [disabled]
    )

    const handleShow = useCallback((event: Event) => {
      event.stopPropagation()
      setIsDropdownOpen(true)
    }, [])

    const handleHide = useCallback((event: Event) => {
      event.stopPropagation()
      setIsDropdownOpen(false)
    }, [])

    return (
      <sl-dropdown open={isDropdownOpen || undefined} hoist onSlShow={handleShow} onSlHide={handleHide}>
        <div className="relative" slot="trigger">
          <sl-input
            class={`date-input ${errorMessage ? 'error' : ''}`}
            onClick={handleInputClick}
            value={formattedValue}
            label={label || undefined}
            disabled={disabled || undefined}
            required={required || undefined}
            placeholder={placeholder || undefined}
            readonly
          >
            <div
              slot="suffix"
              className={`flex items-center justify-end gap-2 ${disabled ? 'cursor-not-allowed' : ''}`}
            >
              {clearable && value && (
                <sl-icon-button library="system" name="windowClose" onClick={handleClear} />
              )}
              <RLIcon name="calendar" />
            </div>
          </sl-input>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
        <Calendar
          value={value}
          onChange={(e) => handleDateSelect(e.value as Date | Date[] | null)}
          dateFormat="yy/mm/dd"
          inline
          selectionMode={selectionMode}
          minDate={minDate}
          maxDate={maxDate}
          showTime={withTime}
          panelClassName="min-w-min !inline"
        />
      </sl-dropdown>
    )
  }
)

RLDatePicker.displayName = 'RLDatePicker'
