import { RLDialog } from '../../RLDialog'

interface TestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TestDialog = ({ open, onOpenChange }: TestDialogProps) => {
  return (
    <RLDialog open={open} onOpenChange={onOpenChange} label="Hello">
      <div className="flex flex-col">from Skillbill!</div>
    </RLDialog>
  )
}

TestDialog.displayName = 'TestDialog'
