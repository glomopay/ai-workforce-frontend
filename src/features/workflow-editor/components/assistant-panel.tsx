import { FC, useState } from 'react';

import { AssistantComposer } from './assistant-composer';
import { AssistantHeader } from './assistant-header';
import { AssistantThread } from './assistant-thread';

interface AssistantPanelProps {
  workflowId: string;
}

// nokey stops React Flow from deleting the selected node on Backspace while typing.
export const AssistantPanel: FC<AssistantPanelProps> = ({ workflowId }) => {
  const [draft, setDraft] = useState('');

  return (
    <aside className='bg-sidebar nokey animate-in fade-in slide-in-from-right-4 fill-mode-both relative flex w-[26rem] shrink-0 flex-col border-l duration-500'>
      <span className='bg-primary/20 animate-aurora pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl' />
      <AssistantHeader workflowId={workflowId} />
      <div className='relative flex min-h-0 flex-1 flex-col overflow-y-auto'>
        <AssistantThread workflowId={workflowId} onPickPrompt={setDraft} />
      </div>
      <AssistantComposer workflowId={workflowId} draft={draft} onDraftChange={setDraft} />
    </aside>
  );
};
