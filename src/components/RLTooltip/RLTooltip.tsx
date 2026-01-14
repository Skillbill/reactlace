import { forwardRef, isValidElement } from 'react'
import SlTooltip from '@shoelace-style/shoelace/dist/react/tooltip/index.js'
import type SlTooltipElement from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
import type { RLTooltipProps } from './types'

export const RLTooltip = forwardRef<SlTooltipElement, RLTooltipProps>(
  (
    {
      content,
      placement = 'top',
      disabled,
      distance = 10,
      open,
      skidding = 0,
      trigger = 'hover focus',
      hoist,
      children
    },
    ref
  ) => {
    const wrappedChildren = isValidElement(children) ? children : <span>{children}</span>

    return (
      <SlTooltip
        ref={ref}
        content={content}
        placement={placement}
        disabled={disabled}
        distance={distance}
        open={open}
        skidding={skidding}
        trigger={trigger}
        hoist={hoist}
      >
        {wrappedChildren}
      </SlTooltip>
    )
  }
)

RLTooltip.displayName = 'RLTooltip'
