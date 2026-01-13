import type { ReactNode, KeyboardEvent } from 'react'
import type { SlAfterShowEvent, SlHideEvent, SlShowEvent, SlAfterHideEvent } from '../utils/types'

export interface RLExpansionCardProps {
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  onShow?: (evt: SlShowEvent) => void
  onHide?: (evt: SlHideEvent) => void
  onAfterShow?: (evt: SlAfterShowEvent) => void
  onAfterHide?: (evt: SlAfterHideEvent) => void
  onKeyUp?: (evt: KeyboardEvent) => void
  titleSlot?: ReactNode
  expandIcon?: ReactNode
  collapseIcon?: ReactNode
  children?: ReactNode
}

export interface RLExpansionCardRef {
  show: () => void
  hide: () => void
}
