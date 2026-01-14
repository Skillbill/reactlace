import { RLIcon } from '../../RLIcon'
import { addIcon } from '../../../icons'

import pencilCircle from '@mdi/svg/svg/pencil-circle.svg'

addIcon('pencilCircle', pencilCircle)

interface ActionEditProps {
  data: unknown
}

export const ActionEdit = (_props: ActionEditProps) => {
  return (
    <RLIcon
      className="text-3xl text-red-500 cursor-pointer hover:opacity-40"
      name="pencilCircle"
    />
  )
}

ActionEdit.displayName = 'ActionEdit'
