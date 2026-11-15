import { createContext } from 'react';
import { Chat } from '@ai-sdk/react';

import { AssistantMessage, CanvasChanges } from '../types/workflow-assistant.types';

export interface WorkflowAssistant {
  chat: Chat<AssistantMessage>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setChanges: (changes: CanvasChanges) => void;
}

export const WorkflowAssistantContext = createContext<WorkflowAssistant | null>(null);
