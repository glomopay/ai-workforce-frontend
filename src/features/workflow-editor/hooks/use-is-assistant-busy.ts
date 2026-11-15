import { useSyncExternalStore } from 'react';

import { useWorkflowAssistant } from './use-workflow-assistant';

// Status only, so the canvas and top bar don't re-render on every streamed token like useChat would.
export const useIsAssistantBusy = () => {
  const { chat } = useWorkflowAssistant();
  const status = useSyncExternalStore(chat['~registerStatusCallback'], () => chat.status);
  return status === 'submitted' || status === 'streaming';
};
