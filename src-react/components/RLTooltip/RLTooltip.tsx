import { forwardRef } from 'react'
import type { RLTooltipProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        content?: string
        placement?: string
        disabled?: boolean
        distance?: number
        open?: boolean
        skidding?: number
        trigger?: string
        hoist?: boolean
      }
    }
  }
}

export const RLTooltip = forwardRef<HTMLElement, RLTooltipProps>(
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
    return (
      <sl-tooltip
        ref={ref}
        content={content}
        placement={placement}
        disabled={disabled || undefined}
        distance={distance}
        open={open || undefined}
        skidding={skidding}
        trigger={trigger}
        hoist={hoist || undefined}
      >
        {children}
      </sl-tooltip>
    )
  }
)

RLTooltip.displayName = 'RLTooltip'
