import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAssistantChat } from './use-assistant-chat';
import { clearAssistantMessages } from '../apis/workflow-editor.api';
import { assistantMessagesQueryOptions } from '../apis/workflow-editor.queries';

export const useClearAssistant = (workflowId: string) => {
  const queryClient = useQueryClient();
  const { setMessages } = useAssistantChat();

  return useMutation({
    mutationFn: () => clearAssistantMessages(workflowId),
    onSuccess: () => {
      setMessages([]);
      queryClient.setQueryData(assistantMessagesQueryOptions(workflowId).queryKey, []);
    },
    throwOnError: true,
  });
};
