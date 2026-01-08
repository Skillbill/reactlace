export interface RLColorPickerProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
  defaultValue?: string
  label: string
  size?: 'small' | 'medium' | 'large'
  name?: string
  hoist?: boolean
  uppercase?: boolean
  swatches?: string | string[]
  form?: string
  required?: boolean
  disabled?: boolean
  opacity?: boolean
}
