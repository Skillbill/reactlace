import { forwardRef, useCallback, useRef, useEffect } from 'react'
import SlDropdown from '@shoelace-style/shoelace/dist/react/dropdown/index.js'
import SlColorPicker from '@shoelace-style/shoelace/dist/react/color-picker/index.js'
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js'
import type SlColorPickerElement from '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js'
import type { RLColorPickerProps } from './types'

export const RLColorPicker = forwardRef<SlColorPickerElement, RLColorPickerProps>(
  (
    {
      value = '#000000',
      onChange,
      className,
      defaultValue,
      label,
      name,
      required,
      disabled,
      opacity
    },
    ref
  ) => {
    const colorPreviewRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (colorPreviewRef.current && value) {
        colorPreviewRef.current.style.backgroundColor = value
      }
    }, [value])

    const handleChange = useCallback(
      (event: CustomEvent) => {
        const target = event.target as SlColorPickerElement
        onChange?.(target?.value ?? '')
      },
      [onChange]
    )

    const handleShow = useCallback((event: CustomEvent) => {
      event.stopPropagation()
    }, [])

    const handleHide = useCallback((event: CustomEvent) => {
      event.stopPropagation()
    }, [])

    return (
      <SlDropdown hoist onSlShow={handleShow} onSlHide={handleHide}>
        <div className={className} slot="trigger">
          <div className="w-full">{label}</div>
          <SlButton className="w-full" caret disabled={disabled}>
            <div className="flex items-center gap-4">
              {value && <div ref={colorPreviewRef} className="w-6 h-6 rounded-full" />}
              {value}
            </div>
          </SlButton>
        </div>
        <SlColorPicker
          ref={ref}
          hoist
          inline
          noFormatToggle
          opacity={opacity}
          value={value}
          name={name}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          onSlChange={handleChange}
        />
      </SlDropdown>
    )
  }
)

RLColorPicker.displayName = 'RLColorPicker'
