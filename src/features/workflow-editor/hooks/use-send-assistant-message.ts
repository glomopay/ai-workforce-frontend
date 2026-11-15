import { useReactFlow } from '@xyflow/react';

import { useHasUnsavedChanges } from './use-has-unsaved-changes';
import { useSaveWorkflow } from './use-save-workflow';
import { useWorkflow } from './use-workflow';
import { useWorkflowAssistant } from './use-workflow-assistant';
import { useWorkflowGraph } from './use-workflow-graph';
import { CanvasNode } from '../types/workflow-editor.types';

// The assistant edits the latest saved version, so canvas edits are saved first or its reload would drop them.
export const useSendAssistantMessage = (workflowId: string) => {
  const workflow = useWorkflow(workflowId);
  const graph = useWorkflowGraph();
  const hasUnsavedChanges = useHasUnsavedChanges(workflowId, graph);
  const { mutate: save, isPending: isSaving, error: saveError, reset } = useSaveWorkflow(workflowId);
  const { chat } = useWorkflowAssistant();
  const { getNodes } = useReactFlow<CanvasNode>();

  const send = (text: string) => {
    const selectedNodeIds = getNodes().flatMap((node) => (node.selected ? [node.id] : []));
    const sendText = () => void chat.sendMessage({ text }, { body: { selectedNodeIds } });
    reset();
    if (hasUnsavedChanges) save({ baseVersionId: workflow.version.id, ...graph }, { onSuccess: sendText });
    else sendText();
  };

  return { send, isSaving, saveError };
};
