import { FC, FormEvent, KeyboardEvent } from 'react';
import { ArrowUp, Square } from 'lucide-react';

import { AssistantContextChip } from './assistant-context-chip';
import { ASSISTANT_MESSAGE_COUNTER_FROM, ASSISTANT_MESSAGE_MAX_LENGTH } from '../constants/workflow-editor.constants';
import { InvalidWorkflowError } from '../errors/invalid-workflow.error';
import { useAssistantChat } from '../hooks/use-assistant-chat';
import { useSendAssistantMessage } from '../hooks/use-send-assistant-message';

import { PulseSpinner } from '@/shared/components/public';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

interface AssistantComposerProps {
  workflowId: string;
  draft: string;
  onDraftChange: (draft: string) => void;
}

export const AssistantComposer: FC<AssistantComposerProps> = ({ workflowId, draft, onDraftChange }) => {
  const { isBusy, stop } = useAssistantChat();
  const { send, isSaving, saveError } = useSendAssistantMessage(workflowId);
  const canSend = draft.trim() !== '' && !isBusy && !isSaving;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSend) return;
    send(draft.trim());
    onDraftChange('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  return (
    <form onSubmit={submit} className='flex flex-col gap-2 border-t p-4'>
      <AssistantContextChip />
      <div
        className={cn(
          'bg-background/60 focus-within:border-primary-soft/50 focus-within:shadow-primary/30 relative flex flex-col rounded-xl border transition-all focus-within:shadow-[0_0_24px]',
          (isBusy || isSaving) && 'border-beam',
        )}>
        <textarea
          value={draft}
          autoFocus
          rows={2}
          maxLength={ASSISTANT_MESSAGE_MAX_LENGTH}
          aria-label='Message the workflow assistant'
          placeholder='Describe a workflow, or a change to this one…'
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={onKeyDown}
          className='placeholder:text-muted-foreground [field-sizing:content] max-h-48 min-h-14 resize-none bg-transparent px-3.5 pt-3 text-sm leading-relaxed outline-none'
        />
        <div className='flex items-center gap-3 px-3.5 pb-2.5'>
          <span className='text-muted-foreground flex-1 font-mono text-[10px] tracking-widest uppercase'>
            {isSaving ? 'Saving canvas first…' : isBusy ? 'Working · canvas locked' : '↵ send · ⇧↵ new line'}
          </span>
          {draft.length >= ASSISTANT_MESSAGE_COUNTER_FROM && (
            <span
              className={cn('font-mono text-[10px]', draft.length >= ASSISTANT_MESSAGE_MAX_LENGTH ? 'text-destructive' : 'text-muted-foreground')}>
              {draft.length}/{ASSISTANT_MESSAGE_MAX_LENGTH}
            </span>
          )}
          {isBusy ? (
            <Button type='button' size='icon-sm' variant='outline' aria-label='Stop' className='border-primary-soft/40' onClick={() => void stop()}>
              <Square className='fill-current' />
            </Button>
          ) : (
            <Button
              type='submit'
              size='icon-sm'
              aria-label='Send'
              disabled={!canSend}
              className='shadow-primary/50 shadow-[0_0_16px] disabled:shadow-none'>
              {isSaving ? <PulseSpinner /> : <ArrowUp />}
            </Button>
          )}
        </div>
      </div>
      {saveError && (
        <p role='alert' className='text-destructive text-xs leading-snug'>
          Your canvas edits didn’t save, so nothing was sent.{' '}
          {saveError instanceof InvalidWorkflowError ? saveError.messages.join(' ') : saveError.message}
        </p>
      )}
    </form>
  );
};
