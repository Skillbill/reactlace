import { RLButton } from '../../RLButton'
import { usersStore } from '../stores/usersStore'

interface DeleteDialogProps {
  data: {
    id: string
    item: unknown
    primary_key: string
    [key: string]: unknown
  }
  onClose?: () => void
  onConfirm?: () => void
  onFetchOnClose?: () => void
}

export const DeleteDialog = ({ data, onClose, onConfirm, onFetchOnClose }: DeleteDialogProps) => {
  const typedItem = data?.item as { username?: string; [key: string]: unknown } | undefined

  const handleCancel = () => {
    onClose?.()
  }

  const handleConfirm = async () => {
    if (typedItem) {
      await usersStore.deleteUser(typedItem[data.primary_key] as string)
    }
    onConfirm?.()
    onFetchOnClose?.()
    onClose?.()
  }

  return (
    <>
      <div slot="label">Delete - {typedItem?.username}</div>
      <div className="flex flex-col">
        Do you want to delete the user?
        <div className="flex justify-end w-full gap-2 mt-4">
          <RLButton onClick={handleCancel}>Cancel</RLButton>
          <RLButton variant="danger" onClick={handleConfirm}>
            Confirm
          </RLButton>
        </div>
      </div>
    </>
  )
}

DeleteDialog.displayName = 'DeleteDialog'
