import { FC, useState } from 'react';
import { Eraser } from 'lucide-react';

import { useClearAssistant } from '../hooks/use-clear-assistant';

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

interface ClearAssistantDialogProps {
  workflowId: string;
  disabled: boolean;
}

export const ClearAssistantDialog: FC<ClearAssistantDialogProps> = ({ workflowId, disabled }) => {
  const [open, setOpen] = useState(false);
  const { mutate: clear, isPending } = useClearAssistant(workflowId);

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon-xs' aria-label='Clear conversation' disabled={disabled}>
          <Eraser />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <span className='text-destructive font-mono text-[10px] tracking-widest uppercase'>Clear conversation</span>
          <DialogTitle>Start a fresh thread?</DialogTitle>
          <DialogDescription>
            The assistant forgets this conversation. The workflow and every version the assistant saved stay as they are.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='ghost' disabled={isPending}>
              Keep it
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            disabled={isPending}
            aria-busy={isPending}
            onClick={() => clear(undefined, { onSuccess: () => setOpen(false) })}>
            {isPending ? (
              <>
                <PulseSpinner />
                Clearing…
              </>
            ) : (
              <>
                <Eraser />
                Clear
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
