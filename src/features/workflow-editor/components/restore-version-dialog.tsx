import { FC, useState } from 'react';
import { History } from 'lucide-react';
import { toast } from 'sonner';

import { RestoreUnsavedWarning } from './restore-unsaved-warning';
import { SavedToast } from './saved-toast';
import { SAVED_TOAST_DURATION } from '../constants/workflow-editor.constants';
import { useIsAssistantBusy } from '../hooks/use-is-assistant-busy';
import { useRestoreVersion } from '../hooks/use-restore-version';
import { useWorkflow } from '../hooks/use-workflow';

import { PulseSpinner } from '@/shared/components/public';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

interface RestoreVersionDialogProps {
  workflowId: string;
  versionId: string;
  number: number;
}

export const RestoreVersionDialog: FC<RestoreVersionDialogProps> = ({ workflowId, versionId, number }) => {
  const [open, setOpen] = useState(false);
  const { version } = useWorkflow(workflowId);
  const isBusy = useIsAssistantBusy();
  const { mutate: restore, isPending, error, reset } = useRestoreVersion(workflowId);

  const onOpenChange = (next: boolean) => {
    if (isPending) return;
    reset();
    setOpen(next);
  };

  const confirm = () =>
    restore(versionId, {
      onSuccess: (saved) => {
        setOpen(false);
        toast.custom(() => <SavedToast workflow={saved} />, { duration: SAVED_TOAST_DURATION });
      },
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' size='xs' className='border-primary-soft/40 self-start' disabled={isBusy}>
          <History className='text-primary-soft' />
          Restore
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>Restore version</span>
          <DialogTitle>Bring back version {number}?</DialogTitle>
          <DialogDescription>
            It is saved as version {version.number + 1}, on top of version {version.number}, so you can restore that one later. The published version
            doesn’t change.
          </DialogDescription>
        </DialogHeader>
        <RestoreUnsavedWarning workflowId={workflowId} />
        {error && (
          <p role='alert' className='text-destructive text-xs leading-snug'>
            {error.message}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending} aria-busy={isPending} onClick={confirm}>
            {isPending ? (
              <>
                <PulseSpinner />
                Restoring…
              </>
            ) : (
              <>
                <History />
                Restore version {number}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
