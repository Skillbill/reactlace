import { forwardRef } from 'react'
import SlIcon from '@shoelace-style/shoelace/dist/react/icon/index.js'
import type SlIconElement from '@shoelace-style/shoelace/dist/components/icon/icon.js'
import type { RLIconProps } from './types'

export const RLIcon = forwardRef<SlIconElement, RLIconProps>(
  ({ name, library = 'default', className, onClick, slot }, ref) => {
    return (
      <SlIcon
        ref={ref}
        className={className}
        library={library}
        name={name}
        onClick={onClick}
        slot={slot}
      />
    )
  }
)

RLIcon.displayName = 'RLIcon'
