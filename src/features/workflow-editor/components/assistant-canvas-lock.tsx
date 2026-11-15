import { FC } from 'react';

import { useAssistantChat } from '../hooks/use-assistant-chat';
import { describeLatestStep } from '../utils/reply-blocks';

import { CornerMarks } from '@/shared/components/public';
import { useExitAnimation } from '@/shared/hooks/use-exit-animation';
import { cn } from '@/shared/utils/cn';

// The assistant saves on top of the version the turn started from and then reloads the canvas,
// so edits made meanwhile would be lost; the canvas and node settings stay locked until it is done.
export const AssistantCanvasLock: FC = () => {
  const { isBusy, messages } = useAssistantChat();
  const { rendered, isExiting, onAnimationEnd } = useExitAnimation(isBusy || undefined);
  if (!rendered) return null;
  const lastMessage = messages.at(-1);
  const step = lastMessage?.role === 'assistant' ? describeLatestStep(lastMessage.parts) : undefined;

  return (
    <div
      onAnimationEnd={onAnimationEnd}
      className={cn(
        'absolute inset-0 z-20 cursor-wait overflow-hidden duration-500',
        isExiting ? 'animate-out fade-out fill-mode-forwards pointer-events-none' : 'animate-in fade-in',
      )}>
      <span className='bg-primary/5 shadow-primary/30 absolute inset-0 shadow-[inset_0_0_160px]' />
      <span className='animate-sweep-x via-primary-soft/10 absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent to-transparent'>
        <span className='bg-primary-soft/60 absolute inset-y-0 right-1/2 w-px shadow-[0_0_12px_var(--primary-soft)]' />
      </span>
      <CornerMarks />
      <div className='bg-popover/80 border-primary-soft/30 shadow-primary/40 absolute bottom-8 left-1/2 flex max-w-[80%] -translate-x-1/2 flex-col items-center gap-1 rounded-xl border px-5 py-2.5 shadow-[0_0_32px] backdrop-blur-xl'>
        <span className='text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest whitespace-nowrap uppercase'>
          <span className='bg-primary-soft size-1.5 animate-pulse rounded-full shadow-[0_0_8px_var(--primary-soft)]' />
          Assistant editing · canvas locked
        </span>
        <span key={step && `${step.verb}${step.text}`} className='animate-in fade-in slide-in-from-bottom-1 max-w-full truncate text-xs duration-300'>
          {step ? (
            <>
              <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>{step.verb}</span> {step.text}
            </>
          ) : (
            <span className='text-muted-foreground'>Reading the canvas…</span>
          )}
        </span>
      </div>
    </div>
  );
};
