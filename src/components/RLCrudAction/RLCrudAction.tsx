import type { RLCrudActionProps } from './types'
import { RLTooltip } from '../RLTooltip'
import { RLIcon } from '../RLIcon'

export const RLCrudAction = ({
  className,
  icon,
  tooltip = '',
  placement = 'top',
  distance = 4,
  onClick
}: RLCrudActionProps) => {
  return (
    <span className={className}>
      <RLTooltip placement={placement} content={tooltip} distance={distance}>
        <RLIcon
          className="text-2xl cursor-pointer hover:opacity-40"
          name={icon}
          onClick={onClick}
        />
      </RLTooltip>
    </span>
  )
}

RLCrudAction.displayName = 'RLCrudAction'
