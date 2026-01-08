import type { ReactNode } from 'react'

export interface RLButtonProps {
  variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text'
  size?: 'small' | 'medium' | 'large'
  caret?: boolean
  disabled?: boolean
  loading?: boolean
  outline?: boolean
  pill?: boolean
  circle?: boolean
  type?: 'button' | 'submit' | 'reset'
  name?: string
  value?: string
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top'
  form?: string
  children?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  className?: string
  onClick?: () => void
}
