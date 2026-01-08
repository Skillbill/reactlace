import type { MouseEvent } from 'react'

export interface RLIconProps {
  name: string
  library?: string
  className?: string
  onClick?: (event: MouseEvent) => void
}
