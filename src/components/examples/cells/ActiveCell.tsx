import { RLIcon } from '../../RLIcon'
import { addIcon } from '../../../icons'

import checkCircle from '@mdi/svg/svg/check-circle.svg'
import closeCircle from '@mdi/svg/svg/close-circle.svg'

addIcon('checkCircle', checkCircle)
addIcon('closeCircle', closeCircle)

interface ActiveCellProps {
  data?: unknown
  trueColor?: string
}

export const ActiveCell = ({ data, trueColor = 'text-green-500' }: ActiveCellProps) => {
  const typedData = data as { active?: boolean } | undefined
  const isActive = typedData?.active

  return (
    <RLIcon
      className={`text-2xl ${isActive ? trueColor : 'text-red-500'}`}
      name={isActive ? 'checkCircle' : 'closeCircle'}
    />
  )
}

ActiveCell.displayName = 'ActiveCell'
