import { FC } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

import { AssistantCanvasLock } from './assistant-canvas-lock';
import { AssistantLeaveDialog } from './assistant-leave-dialog';
import { EditorDock } from './editor-dock';
import { EditorTopBar } from './editor-top-bar';
import { NodeSettingsPanel } from './node-settings-panel';
import { WorkflowCanvas } from './workflow-canvas';
import { useWorkflow } from '../hooks/use-workflow';
import { useWorkflowNodeTypes } from '../hooks/use-workflow-node-types';
import { WorkflowAssistantProvider } from '../providers/workflow-assistant.provider';
import { WorkflowRunProvider } from '../providers/workflow-run.provider';
import { toCanvasEdges, toCanvasNodes } from '../utils/workflow-graph';

interface WorkflowEditorProps {
  workflowId: string;
}

// The provider seeds the store so the top bar sees the graph on first render; the canvas
// seeds it again because React Flow resets the store when it unmounts.
export const WorkflowEditor: FC<WorkflowEditorProps> = ({ workflowId }) => {
  const { version } = useWorkflow(workflowId);
  const nodeTypes = useWorkflowNodeTypes();

  return (
    <ReactFlowProvider defaultNodes={toCanvasNodes(version.nodes, nodeTypes)} defaultEdges={toCanvasEdges(version.connections)}>
      <WorkflowRunProvider>
        <WorkflowAssistantProvider workflowId={workflowId}>
          <div className='flex h-dvh flex-col'>
            <EditorTopBar workflowId={workflowId} />
            {/* Clips side panels while they slide in, so their entrance never scrolls the page. */}
            <div className='flex min-h-0 flex-1 overflow-hidden'>
              <div className='relative flex min-w-0 flex-1'>
                <WorkflowCanvas workflowId={workflowId} />
                <NodeSettingsPanel />
                <AssistantCanvasLock />
              </div>
              <EditorDock workflowId={workflowId} />
            </div>
          </div>
          <AssistantLeaveDialog />
        </WorkflowAssistantProvider>
      </WorkflowRunProvider>
    </ReactFlowProvider>
  );
};
