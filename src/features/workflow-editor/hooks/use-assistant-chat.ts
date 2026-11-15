import { useChat } from '@ai-sdk/react';

import { useWorkflowAssistant } from './use-workflow-assistant';
import { ASSISTANT_RENDER_THROTTLE } from '../constants/workflow-editor.constants';

export const useAssistantChat = () => {
  const chat = useChat({ chat: useWorkflowAssistant().chat, throttle: ASSISTANT_RENDER_THROTTLE });
  return { ...chat, isBusy: chat.status === 'submitted' || chat.status === 'streaming' };
};
