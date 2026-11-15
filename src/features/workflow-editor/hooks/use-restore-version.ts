import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useShowSavedWorkflow } from './use-show-saved-workflow';
import { useWorkflow } from './use-workflow';
import { useWorkflowAssistant } from './use-workflow-assistant';
import { saveWorkflow } from '../apis/workflow-editor.api';
import { workflowVersionQueryOptions } from '../apis/workflow-editor.queries';

// Restoring saves the old graph as a new version, so history only ever grows and a restore is itself undoable.
export const useRestoreVersion = (workflowId: string) => {
  const queryClient = useQueryClient();
  const workflow = useWorkflow(workflowId);
  const showWorkflow = useShowSavedWorkflow(workflowId, useWorkflowAssistant().setChanges);

  return useMutation({
    mutationFn: async (versionId: string) => {
      const { nodes, connections } = await queryClient.fetchQuery(workflowVersionQueryOptions(workflowId, versionId));
      return saveWorkflow(workflowId, { baseVersionId: workflow.version.id, nodes, connections });
    },
    onSuccess: showWorkflow,
  });
};
