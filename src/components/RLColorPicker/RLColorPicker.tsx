import { forwardRef, useCallback, useRef, useEffect } from 'react'
import type { RLColorPickerProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-dropdown': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        hoist?: boolean
        open?: boolean
      }
      'sl-color-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        hoist?: boolean
        inline?: boolean
        noFormatToggle?: boolean
        opacity?: boolean
        value?: string
        name?: string
        defaultValue?: string
        required?: boolean
        disabled?: boolean
      }
    }
  }
}

export const RLColorPicker = forwardRef<HTMLElement, RLColorPickerProps>(
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
    const slColorPickerRef = useRef<HTMLElement>(null)

    useEffect(() => {
      if (colorPreviewRef.current && value) {
        colorPreviewRef.current.style.backgroundColor = value
      }
    }, [value])

    const handleChange = useCallback(
      (event: Event) => {
        const target = event.target as HTMLInputElement
        onChange?.(target?.value ?? '')
      },
      [onChange]
    )

    const handleShow = useCallback((event: Event) => {
      event.stopPropagation()
    }, [])

    const handleHide = useCallback((event: Event) => {
      event.stopPropagation()
    }, [])

    return (
      <sl-dropdown ref={ref} hoist onsl-show={handleShow} onsl-hide={handleHide}>
        <div className={className} slot="trigger">
          <div className="w-full">{label}</div>
          <sl-button class="w-full" caret disabled={disabled || undefined}>
            <div className="flex items-center gap-4">
              {value && <div ref={colorPreviewRef} className="w-6 h-6 rounded-full" />}
              {value}
            </div>
          </sl-button>
        </div>
        <sl-color-picker
          ref={slColorPickerRef}
          hoist
          inline
          noFormatToggle
          opacity={opacity || undefined}
          value={value}
          name={name || undefined}
          defaultValue={defaultValue || undefined}
          required={required || undefined}
          disabled={disabled || undefined}
          onsl-change={handleChange}
        />
      </sl-dropdown>
    )
  }
)

RLColorPicker.displayName = 'RLColorPicker'
