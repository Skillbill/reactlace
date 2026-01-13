import { forwardRef, useImperativeHandle, useCallback, useRef } from 'react'
import type { RLDialogProps, RLDialogRef } from './types'
import type { SlRequestCloseEvent } from '../utils/types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string
        open?: boolean
        noHeader?: boolean
        class?: string
        onSlShow?: (event: Event) => void
        onSlAfterShow?: (event: Event) => void
        onSlHide?: (event: Event) => void
        onSlAfterHide?: (event: Event) => void
        onSlInitialFocus?: (event: Event) => void
        onSlRequestClose?: (event: Event) => void
      }
    }
  }
}

export const RLDialog = forwardRef<RLDialogRef, RLDialogProps>(
  (
    {
      open,
      onOpenChange,
      label,
      noHeader,
      noCloseOnOutsideClick,
      className,
      onShow,
      onAfterShow,
      onHide,
      onAfterHide,
      onInitialFocus,
      onRequestClose,
      children
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLElement & { open: boolean; show: () => void; hide: () => void }>(null)

    useImperativeHandle(ref, () => ({
      open: dialogRef.current?.open,
      show: () => dialogRef.current?.show(),
      hide: () => dialogRef.current?.hide()
    }))

    const handleRequestClose = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlRequestCloseEvent
        if (noCloseOnOutsideClick && evt.detail.source === 'overlay') {
          evt.preventDefault()
          return
        }

        onOpenChange?.(false)
        onRequestClose?.(evt)
      },
      [noCloseOnOutsideClick, onOpenChange, onRequestClose]
    )

    const handleShow = useCallback(
      (event: Event) => {
        onShow?.(event as unknown as Parameters<NonNullable<typeof onShow>>[0])
      },
      [onShow]
    )

    const handleAfterShow = useCallback(
      (event: Event) => {
        onAfterShow?.(event as unknown as Parameters<NonNullable<typeof onAfterShow>>[0])
      },
      [onAfterShow]
    )

    const handleHide = useCallback(
      (event: Event) => {
        onHide?.(event as unknown as Parameters<NonNullable<typeof onHide>>[0])
      },
      [onHide]
    )

    const handleAfterHide = useCallback(
      (event: Event) => {
        onAfterHide?.(event as unknown as Parameters<NonNullable<typeof onAfterHide>>[0])
      },
      [onAfterHide]
    )

    const handleInitialFocus = useCallback(
      (event: Event) => {
        onInitialFocus?.(event as unknown as Parameters<NonNullable<typeof onInitialFocus>>[0])
      },
      [onInitialFocus]
    )

    return (
      <sl-dialog
        ref={dialogRef}
        class={className ?? 'dialog'}
        label={label}
        open={open || undefined}
        noHeader={noHeader || undefined}
        onSlShow={handleShow}
        onSlAfterShow={handleAfterShow}
        onSlHide={handleHide}
        onSlAfterHide={handleAfterHide}
        onSlInitialFocus={handleInitialFocus}
        onSlRequestClose={handleRequestClose}
      >
        {children}
      </sl-dialog>
    )
  }
)

RLDialog.displayName = 'RLDialog'
