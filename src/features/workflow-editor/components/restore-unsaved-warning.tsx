import { FC } from 'react';
import { TriangleAlert } from 'lucide-react';

import { useHasUnsavedChanges } from '../hooks/use-has-unsaved-changes';
import { useWorkflowGraph } from '../hooks/use-workflow-graph';

interface RestoreUnsavedWarningProps {
  workflowId: string;
}

export const RestoreUnsavedWarning: FC<RestoreUnsavedWarningProps> = ({ workflowId }) => {
  const hasUnsavedChanges = useHasUnsavedChanges(workflowId, useWorkflowGraph());
  if (!hasUnsavedChanges) return null;

  return (
    <p className='text-destructive flex items-start gap-2 text-xs leading-snug'>
      <TriangleAlert className='mt-px size-3.5 shrink-0' />
      Your unsaved edits on the canvas are discarded.
    </p>
  );
};
