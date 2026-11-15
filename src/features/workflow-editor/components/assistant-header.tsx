import { FC } from 'react';
import { X } from 'lucide-react';

import { ClearAssistantDialog } from './clear-assistant-dialog';
import { useAssistantChat } from '../hooks/use-assistant-chat';
import { useWorkflowAssistant } from '../hooks/use-workflow-assistant';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

interface AssistantHeaderProps {
  workflowId: string;
}

export const AssistantHeader: FC<AssistantHeaderProps> = ({ workflowId }) => {
  const { setIsOpen } = useWorkflowAssistant();
  const { messages, status, isBusy } = useAssistantChat();
  const turns = messages.filter(({ role }) => role === 'user').length;

  return (
    <header className='relative flex flex-col gap-3 border-b px-4 pt-4 pb-3'>
      <div className='flex items-center gap-2'>
        <span className='text-primary-soft flex-1 font-mono text-[10px] tracking-widest uppercase'>Workflow assistant</span>
        <ClearAssistantDialog workflowId={workflowId} disabled={isBusy || !messages.length} />
        <Button variant='ghost' size='icon-xs' aria-label='Close assistant' onClick={() => setIsOpen(false)}>
          <X />
        </Button>
      </div>
      <div className='text-muted-foreground flex justify-between font-mono text-[10px] tracking-widest uppercase'>
        <span className='flex items-center gap-2'>
          <span
            className={cn(
              'size-1.5 rounded-full',
              isBusy && 'bg-primary-soft animate-pulse shadow-[0_0_8px_var(--primary-soft)]',
              status === 'error' && 'bg-destructive',
              status === 'ready' && 'bg-primary-soft',
            )}
          />
          {isBusy ? 'Working · edits save as a version' : status === 'error' ? 'Last turn failed' : 'Online · idle'}
        </span>
        <span>
          {turns} {turns === 1 ? 'turn' : 'turns'}
        </span>
      </div>
      {isBusy && (
        <span className='pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden'>
          <span className='animate-indeterminate via-primary-soft block h-full w-1/4 bg-linear-to-r from-transparent to-transparent shadow-[0_0_8px_var(--primary-soft)]' />
        </span>
      )}
    </header>
  );
};
