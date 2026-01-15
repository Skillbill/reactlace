import { RLIcon } from '../../RLIcon'
import { addIcon } from '../../../icons'

import deleteCircle from '@mdi/svg/svg/delete-circle.svg'

addIcon('deleteCircle', deleteCircle)

interface ActionDeleteProps {
  data: unknown
}

export const ActionDelete = (_props: ActionDeleteProps) => {
  return (
    <RLIcon
      className="text-3xl text-red-500 cursor-pointer hover:opacity-40"
      name="deleteCircle"
    />
  )
}

ActionDelete.displayName = 'ActionDelete'
