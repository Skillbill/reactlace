import type { ReactNode } from 'react'
import type {
  SlAfterShowEvent,
  SlHideEvent,
  SlShowEvent,
  SlAfterHideEvent,
  SlInitialFocusEvent,
  SlRequestCloseEvent
} from '../utils/types'

export interface RLDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  label?: string
  noHeader?: boolean
  noCloseOnOutsideClick?: boolean
  onShow?: (evt: SlShowEvent) => void
  onAfterShow?: (evt: SlAfterShowEvent) => void
  onHide?: (evt: SlHideEvent) => void
  onAfterHide?: (evt: SlAfterHideEvent) => void
  onInitialFocus?: (evt: SlInitialFocusEvent) => void
  onRequestClose?: (evt: SlRequestCloseEvent) => void
  children?: ReactNode
}

export interface RLDialogRef {
  open?: boolean
  show: () => void
  hide: () => void
}
