import { DefaultChatTransport } from 'ai';

import { throwWorkflowError } from './workflow-editor.api';
import { WORKFLOW_EDITOR_ENDPOINTS } from '../constants/workflow-editor.constants';
import { AssistantMessage } from '../types/workflow-assistant.types';

// The server keeps the thread, so a turn sends only the new message; useChat's default body is rejected with a 400.
// Apart from workflow-editor.api so the route loaders, which import its queries, don't pull in the AI SDK.
export const createAssistantTransport = (workflowId: string) =>
  new DefaultChatTransport<AssistantMessage>({
    api: WORKFLOW_EDITOR_ENDPOINTS.ASSISTANT_MESSAGES(workflowId),
    credentials: 'include',
    prepareSendMessagesRequest: ({ messages }) => ({ body: { message: messages.at(-1) } }),
    fetch: async (input, init) => {
      const response = await fetch(input, init);
      if (!response.ok) await throwWorkflowError(response, `POST ${String(input)}`);
      return response;
    },
  });
