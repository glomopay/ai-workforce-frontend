import { FC } from 'react';

const DOT_DELAYS = ['0ms', '150ms', '300ms'];

export const AssistantThinking: FC = () => (
  <div className='animate-in fade-in flex items-center gap-2.5 duration-300'>
    <span className='flex gap-1'>
      {DOT_DELAYS.map((delay) => (
        <span
          key={delay}
          className='bg-primary-soft size-1.5 animate-pulse rounded-full shadow-[0_0_6px_var(--primary-soft)]'
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
    <span className='text-muted-foreground relative overflow-hidden font-mono text-[10px] tracking-widest uppercase'>
      Thinking
      <span className='animate-shimmer via-primary-soft/40 absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent to-transparent' />
    </span>
  </div>
);
