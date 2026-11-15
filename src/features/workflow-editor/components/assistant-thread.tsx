import { FC, Fragment } from 'react';
import { TriangleAlert } from 'lucide-react';

import { AssistantEmptyState } from './assistant-empty-state';
import { AssistantReply } from './assistant-reply';
import { AssistantThinking } from './assistant-thinking';
import { AssistantUnansweredNote } from './assistant-unanswered-note';
import { AssistantUserMessage } from './assistant-user-message';
import { useAssistantChat } from '../hooks/use-assistant-chat';
import { useStickToBottom } from '../hooks/use-stick-to-bottom';

import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface AssistantThreadProps {
  workflowId: string;
  onPickPrompt: (prompt: string) => void;
}

export const AssistantThread: FC<AssistantThreadProps> = ({ workflowId, onPickPrompt }) => {
  const { messages, status, error, clearError } = useAssistantChat();
  const { viewportRef, contentRef } = useStickToBottom(messages.length);

  return (
    <ScrollArea viewportRef={viewportRef} className='min-h-0 flex-1'>
      <div ref={contentRef}>
        {!messages.length && status === 'ready' ? (
          <AssistantEmptyState onPick={onPickPrompt} />
        ) : (
          <div className='flex flex-col gap-5 p-4'>
            {messages.map((message, index) =>
              message.role === 'user' ? (
                <Fragment key={message.id}>
                  <AssistantUserMessage text={message.parts.flatMap((part) => (part.type === 'text' ? [part.text] : [])).join('\n')} />
                  {(messages[index + 1]?.role === 'user' || (index === messages.length - 1 && status === 'ready')) && <AssistantUnansweredNote />}
                </Fragment>
              ) : (
                <AssistantReply
                  key={message.id}
                  workflowId={workflowId}
                  message={message}
                  isLive={status === 'streaming' && index === messages.length - 1}
                />
              ),
            )}
            {status === 'submitted' && <AssistantThinking />}
            {error && (
              <div role='alert' className='border-destructive/40 bg-destructive/5 flex flex-col gap-2 rounded-lg border p-3'>
                <span className='text-destructive flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase'>
                  <TriangleAlert className='size-3.5' />
                  Turn failed
                </span>
                <p className='text-xs leading-snug'>{error.message}</p>
                <Button variant='ghost' size='xs' className='self-start' onClick={clearError}>
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
