import { FC, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { useDeleteCredential } from '../hooks/use-delete-credential';
import { WorkflowCredential } from '../types/workflow-credentials.types';

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

interface DeleteCredentialDialogProps {
  credential: WorkflowCredential;
}

// nokey: the dialog is portalled out of the panel, and Backspace there must not delete the node.
export const DeleteCredentialDialog: FC<DeleteCredentialDialogProps> = ({ credential }) => {
  const [open, setOpen] = useState(false);
  const { mutate: remove, isPending, error, reset } = useDeleteCredential();

  const onOpenChange = (next: boolean) => {
    if (isPending) return;
    reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label='Delete account' className='text-muted-foreground hover:text-destructive'>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!isPending} className='nokey'>
        <DialogHeader>
          <span className='text-destructive font-mono text-[10px] tracking-widest uppercase'>Delete account</span>
          <DialogTitle className='break-all'>Delete {credential.name}?</DialogTitle>
          <DialogDescription>
            Every workflow that uses this account fails at that step with “credential not found” until someone picks another account in the node.
            Google access is revoked too, unless another of your accounts here uses the same Google account.
          </DialogDescription>
        </DialogHeader>
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
          <Button
            variant='destructive'
            disabled={isPending}
            aria-busy={isPending}
            onClick={() => remove(credential.id, { onSuccess: () => setOpen(false) })}>
            {isPending ? (
              <>
                <PulseSpinner />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 />
                Delete account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
