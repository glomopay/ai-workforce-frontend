import { FC, Suspense } from 'react';

import { EditFieldsPreviewOutput } from './edit-fields-preview-output';
import { EmptyOutput } from './empty-output';
import { RunDataLoading } from './run-data-loading';
import { useWorkflowRun } from '../hooks/use-workflow-run';
import { CanvasNode } from '../types/workflow-editor.types';

interface EditFieldsPreviewProps {
  node: CanvasNode;
}

export const EditFieldsPreview: FC<EditFieldsPreviewProps> = ({ node }) => {
  const { execution } = useWorkflowRun();
  if (!execution) return <EmptyOutput label='Output preview' message='Run the workflow to preview with its data' />;

  return (
    <Suspense fallback={<RunDataLoading />}>
      <EditFieldsPreviewOutput executionId={execution.id} node={node} />
    </Suspense>
  );
};
