import { forwardRef } from 'react'
import type { RLIconProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string
        library?: string
        class?: string
      }
    }
  }
}

export const RLIcon = forwardRef<HTMLElement, RLIconProps>(
  ({ name, library = 'default', className, onClick }, ref) => {
    return (
      <sl-icon
        ref={ref}
        class={className}
        library={library}
        name={name}
        onClick={onClick}
      />
    )
  }
)

RLIcon.displayName = 'RLIcon'
