import { FC } from 'react';

// A turn that was disconnected, timed out or failed stores the user message and no reply.
export const AssistantUnansweredNote: FC = () => (
  <span className='text-muted-foreground -mt-3 self-end font-mono text-[10px] tracking-widest uppercase'>No reply · nothing saved</span>
);
