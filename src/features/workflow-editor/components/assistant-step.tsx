import { FC, ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

export type StepState = 'pending' | 'done' | 'failed' | 'stopped';

const DOT_CLASSES: Record<StepState, string> = {
  pending: 'bg-background border-primary-soft animate-pulse shadow-[0_0_8px_var(--primary-soft)]',
  done: 'bg-primary-soft border-primary-soft shadow-[0_0_6px_var(--primary-soft)]',
  failed: 'bg-destructive border-destructive',
  stopped: 'bg-background border-muted-foreground',
};

interface AssistantStepProps {
  state: StepState;
  verb: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const AssistantStep: FC<AssistantStepProps> = ({ state, verb, icon, children }) => (
  <li className='animate-in fade-in slide-in-from-left-1 relative flex items-center gap-2 py-1 pl-4 text-xs duration-300'>
    <span className={cn('absolute top-1/2 -left-[3.5px] size-1.5 -translate-y-1/2 rounded-full border', DOT_CLASSES[state])} />
    <span
      className={cn(
        'w-14 shrink-0 font-mono text-[10px] tracking-widest uppercase',
        state === 'failed' && 'text-destructive',
        state === 'stopped' && 'text-muted-foreground',
        (state === 'pending' || state === 'done') && 'text-primary-soft',
      )}>
      {verb}
    </span>
    {icon}
    <span className={cn('min-w-0 truncate', state === 'failed' || state === 'stopped' ? 'text-muted-foreground line-through' : 'text-foreground/90')}>
      {children}
    </span>
  </li>
);
