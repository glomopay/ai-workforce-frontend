import { FC } from 'react';
import { useStore } from '@xyflow/react';

import { AssistantOrb } from './assistant-orb';
import { AssistantStarterPrompt } from './assistant-starter-prompt';
import { ASSISTANT_STARTER_PROMPTS } from '../constants/workflow-editor.constants';

interface AssistantEmptyStateProps {
  onPick: (prompt: string) => void;
}

export const AssistantEmptyState: FC<AssistantEmptyStateProps> = ({ onPick }) => {
  const isCanvasEmpty = useStore((state) => state.nodes.length === 0);
  const prompts = isCanvasEmpty ? ASSISTANT_STARTER_PROMPTS.build : ASSISTANT_STARTER_PROMPTS.refine;

  return (
    <div className='flex flex-col items-center px-5 pt-6 pb-4 text-center'>
      <div className='animate-in fade-in zoom-in-90 fill-mode-both duration-700'>
        <AssistantOrb />
      </div>
      <h2 className='animate-in fade-in slide-in-from-bottom-2 fill-mode-both mt-4 text-2xl font-semibold tracking-tight delay-150 duration-500'>
        Describe it.{' '}
        <span className='from-primary-soft bg-linear-to-r to-white bg-clip-text text-transparent'>
          {isCanvasEmpty ? 'I’ll wire it.' : 'I’ll rewire it.'}
        </span>
      </h2>
      <p className='text-muted-foreground animate-in fade-in slide-in-from-bottom-2 fill-mode-both mt-2 text-xs leading-relaxed delay-300 duration-500'>
        I add, connect and configure nodes on this canvas. Each reply that changes something saves a new version you can restore. I never run or
        publish the workflow.
      </p>
      <div className='mt-6 flex w-full flex-col gap-2'>
        {prompts.map((prompt, index) => (
          <AssistantStarterPrompt key={prompt} index={index} prompt={prompt} onPick={onPick} />
        ))}
      </div>
    </div>
  );
};
