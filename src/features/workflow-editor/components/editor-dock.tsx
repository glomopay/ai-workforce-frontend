import { FC } from 'react';

import { AssistantPanel } from './assistant-panel';
import { NodePalette } from './node-palette';
import { useWorkflowAssistant } from '../hooks/use-workflow-assistant';

interface EditorDockProps {
  workflowId: string;
}

// The assistant takes the palette's column, so opening it never squeezes the canvas further.
export const EditorDock: FC<EditorDockProps> = ({ workflowId }) =>
  useWorkflowAssistant().isOpen ? <AssistantPanel workflowId={workflowId} /> : <NodePalette />;
