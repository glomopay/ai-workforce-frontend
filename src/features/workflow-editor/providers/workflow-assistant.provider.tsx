import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Chat } from '@ai-sdk/react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { createAssistantTransport } from '../apis/workflow-assistant.transport';
import { assistantMessagesQueryOptions, workflowQueryOptions } from '../apis/workflow-editor.queries';
import { CanvasChangesContext } from '../contexts/canvas-changes.context';
import { WorkflowAssistantContext } from '../contexts/workflow-assistant.context';
import { useShowSavedWorkflow } from '../hooks/use-show-saved-workflow';
import { AssistantMessage, CanvasChanges } from '../types/workflow-assistant.types';

interface WorkflowAssistantProviderProps {
  workflowId: string;
  children: ReactNode;
}

// The chat lives here rather than in the panel so a turn keeps streaming while the panel is closed.
export const WorkflowAssistantProvider: FC<WorkflowAssistantProviderProps> = ({ workflowId, children }) => {
  const queryClient = useQueryClient();
  const { data: messages } = useSuspenseQuery(assistantMessagesQueryOptions(workflowId));
  const [isOpen, setIsOpen] = useState(false);
  const [changes, setChanges] = useState<CanvasChanges | null>(null);
  const showWorkflow = useShowSavedWorkflow(workflowId, setChanges);

  // The chat keeps the callbacks from the first render, which is safe because everything they touch is stable.
  const [chat] = useState(() => {
    const created: Chat<AssistantMessage> = new Chat<AssistantMessage>({
      id: workflowId,
      messages,
      transport: createAssistantTransport(workflowId),
      onData: (part) => {
        if (part.type !== 'data-workflow-version') return;
        void queryClient.fetchQuery({ ...workflowQueryOptions(workflowId), staleTime: 0 }).then(showWorkflow);
      },
      onFinish: ({ message, messages: thread, isAbort }) => {
        if (isAbort) created.messages = thread.map((item) => (item.id === message.id ? { ...item, metadata: { stopped: true } } : item));
        queryClient.setQueryData(assistantMessagesQueryOptions(workflowId).queryKey, created.messages);
      },
    });
    return created;
  });

  // Leaving the editor mid-turn disconnects, and the backend saves nothing for an aborted turn.
  useEffect(() => () => void chat.stop(), [chat]);

  const workflowAssistant = useMemo(() => ({ chat, isOpen, setIsOpen, setChanges }), [chat, isOpen]);

  return (
    <WorkflowAssistantContext value={workflowAssistant}>
      <CanvasChangesContext value={changes}>{children}</CanvasChangesContext>
    </WorkflowAssistantContext>
  );
};
