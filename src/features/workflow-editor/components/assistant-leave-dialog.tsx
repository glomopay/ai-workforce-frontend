import { FC } from 'react';
import { useBlocker } from '@tanstack/react-router';

import { useIsAssistantBusy } from '../hooks/use-is-assistant-busy';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

// Leaving the editor disconnects the turn, and the backend saves nothing for a disconnected turn.
export const AssistantLeaveDialog: FC = () => {
  const isBusy = useIsAssistantBusy();
  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: () => isBusy,
    enableBeforeUnload: isBusy,
    withResolver: true,
  });

  return (
    <Dialog open={status === 'blocked'} onOpenChange={(open) => !open && reset?.()}>
      <DialogContent>
        <DialogHeader>
          <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>Assistant working</span>
          <DialogTitle>Stop the assistant and leave?</DialogTitle>
          <DialogDescription>It is still editing this workflow. Leaving stops it, and nothing from this turn is saved.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='ghost' onClick={reset}>
            Stay in editor
          </Button>
          <Button variant='destructive' onClick={proceed}>
            Stop and leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
