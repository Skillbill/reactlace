import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import SlDetails from '@shoelace-style/shoelace/dist/react/details/index.js'
import type SlDetailsElement from '@shoelace-style/shoelace/dist/components/details/details.js'
import type { RLExpansionCardProps, RLExpansionCardRef } from './types'
import { RLIcon } from '../RLIcon'

export const RLExpansionCard = forwardRef<RLExpansionCardRef, RLExpansionCardProps>(
  (
    {
      title,
      open,
      onOpenChange,
      className,
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
    const detailsRef = useRef<SlDetailsElement>(null)

    useImperativeHandle(ref, () => ({
      show: () => detailsRef.current?.show(),
      hide: () => detailsRef.current?.hide()
    }))

    const handleShow = useCallback(
      (event: CustomEvent) => {
        onOpenChange?.(true)
        onShow?.(event)
      },
      [onOpenChange, onShow]
    )

    const handleHide = useCallback(
      (event: CustomEvent) => {
        onOpenChange?.(false)
        onHide?.(event)
      },
      [onOpenChange, onHide]
    )

    const handleAfterShow = useCallback(
      (event: CustomEvent) => {
        onAfterShow?.(event)
      },
      [onAfterShow]
    )

    const handleAfterHide = useCallback(
      (event: CustomEvent) => {
        onAfterHide?.(event)
      },
      [onAfterHide]
    )

    return (
      <SlDetails
        ref={detailsRef}
        className={className}
        open={open}
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
      </SlDetails>
    )
  }
)

RLExpansionCard.displayName = 'RLExpansionCard'
