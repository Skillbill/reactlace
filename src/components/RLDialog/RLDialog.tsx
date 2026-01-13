import { forwardRef, useImperativeHandle, useCallback, useRef } from 'react'
import SlDialog from '@shoelace-style/shoelace/dist/react/dialog/index.js'
import type SlDialogElement from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import type { RLDialogProps, RLDialogRef } from './types'
import type { SlRequestCloseEvent } from '../utils/types'

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
    const dialogRef = useRef<SlDialogElement>(null)

    useImperativeHandle(ref, () => ({
      open: dialogRef.current?.open,
      show: () => dialogRef.current?.show(),
      hide: () => dialogRef.current?.hide()
    }))

    const handleRequestClose = useCallback(
      (event: CustomEvent) => {
        const evt = event as SlRequestCloseEvent
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
      (event: CustomEvent) => {
        onShow?.(event)
      },
      [onShow]
    )

    const handleAfterShow = useCallback(
      (event: CustomEvent) => {
        onAfterShow?.(event)
      },
      [onAfterShow]
    )

    const handleHide = useCallback(
      (event: CustomEvent) => {
        onHide?.(event)
      },
      [onHide]
    )

    const handleAfterHide = useCallback(
      (event: CustomEvent) => {
        onAfterHide?.(event)
      },
      [onAfterHide]
    )

    const handleInitialFocus = useCallback(
      (event: CustomEvent) => {
        onInitialFocus?.(event)
      },
      [onInitialFocus]
    )

    return (
      <SlDialog
        ref={dialogRef}
        className={className ?? 'dialog'}
        label={label}
        open={open}
        noHeader={noHeader}
        onSlShow={handleShow}
        onSlAfterShow={handleAfterShow}
        onSlHide={handleHide}
        onSlAfterHide={handleAfterHide}
        onSlInitialFocus={handleInitialFocus}
        onSlRequestClose={handleRequestClose}
      >
        {children}
      </SlDialog>
    )
  }
)

RLDialog.displayName = 'RLDialog'
