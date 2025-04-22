import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ActiveSessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ActiveSessionDialog({
  isOpen,
  onClose,
  onConfirm,
}: ActiveSessionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Active Session Detected</DialogTitle>
          <DialogDescription>
            There is already an active session for this user. If you continue, the current session will be logged out.
            Do you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 