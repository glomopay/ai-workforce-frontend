import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateWorkflow } from '../apis/workflow-editor.api';
import { workflowQueryOptions } from '../apis/workflow-editor.queries';
import { UpdateWorkflowInput } from '../types/workflow-editor.types';

import { ValidationError, workflowsQueryOptions } from '@/features/workflows/public';

// The cached version is the one the canvas draft saves against, so only the unversioned fields are taken from the response.
export const useUpdateWorkflow = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWorkflowInput) => updateWorkflow(workflowId, input),
    onSuccess: ({ id, name, description, latestVersion, activeVersionId, createdAt, updatedAt }) => {
      queryClient.setQueryData(workflowQueryOptions(workflowId).queryKey, (workflow) => workflow && { ...workflow, name, description, updatedAt });
      queryClient.setQueryData(
        workflowsQueryOptions.queryKey,
        (workflows) =>
          workflows && [
            { id, name, description, latestVersion, activeVersionId, createdAt, updatedAt },
            ...workflows.filter((workflow) => workflow.id !== id),
          ],
      );
    },
    throwOnError: (error) => !(error instanceof ValidationError),
  });
};
