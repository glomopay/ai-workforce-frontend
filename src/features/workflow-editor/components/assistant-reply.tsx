import { FC } from 'react';
import { Square } from 'lucide-react';

import { AssistantSteps } from './assistant-steps';
import { AssistantVersionCard } from './assistant-version-card';
import { AssistantMessage } from '../types/workflow-assistant.types';
import { findAppliedOperations, toReplyBlocks } from '../utils/reply-blocks';

interface AssistantReplyProps {
  workflowId: string;
  message: AssistantMessage;
  isLive: boolean;
}

export const AssistantReply: FC<AssistantReplyProps> = ({ workflowId, message, isLive }) => (
  <div className='flex flex-col gap-3'>
    {toReplyBlocks(message.parts).map((block) => {
      if (block.kind === 'steps') return <AssistantSteps key={block.key} parts={block.parts} isLive={isLive} />;
      return (
        <p key={block.key} className='animate-in fade-in text-sm leading-relaxed whitespace-pre-wrap duration-300'>
          {block.text}
        </p>
      );
    })}
    {message.metadata?.workflowVersion && (
      <AssistantVersionCard
        workflowId={workflowId}
        versionId={message.metadata.workflowVersion.id}
        number={message.metadata.workflowVersion.number}
        operations={findAppliedOperations(message.parts)}
      />
    )}
    {isLive && <span className='bg-primary-soft h-3.5 w-1.5 animate-pulse shadow-[0_0_8px_var(--primary-soft)]' />}
    {message.metadata?.stopped && (
      <span className='text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase'>
        <Square className='size-2.5 fill-current' />
        Stopped · nothing saved
      </span>
    )}
  </div>
);
