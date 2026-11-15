import { useHasUnsavedChanges } from './use-has-unsaved-changes';
import { useSaveWorkflow } from './use-save-workflow';
import { useWorkflow } from './use-workflow';
import { useWorkflowAssistant } from './use-workflow-assistant';
import { useWorkflowGraph } from './use-workflow-graph';

// The assistant edits the latest saved version, so canvas edits are saved first or its reload would drop them.
export const useSendAssistantMessage = (workflowId: string) => {
  const workflow = useWorkflow(workflowId);
  const graph = useWorkflowGraph();
  const hasUnsavedChanges = useHasUnsavedChanges(workflowId, graph);
  const { mutate: save, isPending: isSaving, error: saveError, reset } = useSaveWorkflow(workflowId);
  const { chat } = useWorkflowAssistant();

  const send = (text: string) => {
    const sendText = () => void chat.sendMessage({ text });
    reset();
    if (hasUnsavedChanges) save({ baseVersionId: workflow.version.id, ...graph }, { onSuccess: sendText });
    else sendText();
  };

  return { send, isSaving, saveError };
};
