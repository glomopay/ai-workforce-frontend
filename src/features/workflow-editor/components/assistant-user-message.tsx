import { FC } from 'react';

interface AssistantUserMessageProps {
  text: string;
}

export const AssistantUserMessage: FC<AssistantUserMessageProps> = ({ text }) => (
  <div className='bg-primary/15 border-primary-soft/25 animate-in fade-in slide-in-from-bottom-2 max-w-[85%] self-end rounded-xl rounded-br-sm border px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap duration-300'>
    {text}
  </div>
);
