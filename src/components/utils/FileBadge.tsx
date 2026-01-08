import type { ReactNode, MouseEvent } from 'react'
import { RLIcon } from '../RLIcon'

export interface FileBadgeProps {
  children?: ReactNode
  onRemove?: (event: MouseEvent) => void
}

export function FileBadge({ children, onRemove }: FileBadgeProps) {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleRemove = (event: MouseEvent) => {
    event.preventDefault()
    onRemove?.(event)
  }

  return (
    <span
      className="flex items-center px-2 rounded-full bg-accent max-w-96 text-on-accent"
      onClick={handleClick}
    >
      <span className="truncate">{children}</span>
      <RLIcon
        className="pl-2 cursor-pointer hover:opacity-40"
        library="system"
        name="windowClose"
        onClick={handleRemove}
      />
    </span>
  )
}
