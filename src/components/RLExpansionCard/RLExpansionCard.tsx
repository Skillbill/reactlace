import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import type { RLExpansionCardProps, RLExpansionCardRef } from './types'
import type { SlAfterShowEvent, SlHideEvent, SlShowEvent, SlAfterHideEvent } from '../utils/types'
import { RLIcon } from '../RLIcon'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-details': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        open?: boolean
      }
    }
  }
}

export const RLExpansionCard = forwardRef<RLExpansionCardRef, RLExpansionCardProps>(
  (
    {
      title,
      open,
      onOpenChange,
      onShow,
      onHide,
      onAfterShow,
      onAfterHide,
      onKeyUp,
      titleSlot,
      expandIcon,
      collapseIcon,
      children
    },
    ref
  ) => {
    const detailsRef = useRef<HTMLElement & { show: () => void; hide: () => void }>(null)

    useImperativeHandle(ref, () => ({
      show: () => detailsRef.current?.show(),
      hide: () => detailsRef.current?.hide()
    }))

    const handleShow = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlShowEvent
        onOpenChange?.(true)
        onShow?.(evt)
      },
      [onOpenChange, onShow]
    )

    const handleHide = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlHideEvent
        onOpenChange?.(false)
        onHide?.(evt)
      },
      [onOpenChange, onHide]
    )

    const handleAfterShow = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlAfterShowEvent
        onAfterShow?.(evt)
      },
      [onAfterShow]
    )

    const handleAfterHide = useCallback(
      (event: Event) => {
        const evt = event as unknown as SlAfterHideEvent
        onAfterHide?.(evt)
      },
      [onAfterHide]
    )

    return (
      <sl-details
        ref={detailsRef}
        open={open || undefined}
        onSlShow={handleShow}
        onSlHide={handleHide}
        onSlAfterShow={handleAfterShow}
        onSlAfterHide={handleAfterHide}
        onKeyUp={onKeyUp}
      >
        <div slot="summary">
          {titleSlot || <h3 className="text-xl font-semibold capitalize">{title}</h3>}
        </div>
        <div slot="expand-icon">
          {expandIcon || <RLIcon className="text-3xl" name="chevronRight" />}
        </div>
        <div slot="collapse-icon">
          {collapseIcon || <RLIcon className="text-3xl" name="chevronRight" />}
        </div>
        {children}
      </sl-details>
    )
  }
)

RLExpansionCard.displayName = 'RLExpansionCard'
