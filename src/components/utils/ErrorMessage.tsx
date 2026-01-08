import type { ReactNode } from 'react'

export interface ErrorMessageProps {
  children?: ReactNode
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <span
      className="absolute text-xs left-2 line-clamp-2"
      style={{ color: 'var(--sl-color-danger-500)' }}
    >
      {children}
    </span>
  )
}
