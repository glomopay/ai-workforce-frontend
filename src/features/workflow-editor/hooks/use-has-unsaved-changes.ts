import { useMemo } from 'react';

import { useWorkflow } from './use-workflow';
import { useWorkflowNodeTypes } from './use-workflow-node-types';
import { WorkflowGraph } from '../types/workflow-editor.types';
import { toStableJson } from '../utils/json-object';
import { toCanvasEdges, toCanvasNodes, toWorkflowGraph } from '../utils/workflow-graph';

export const useHasUnsavedChanges = (workflowId: string, graph: WorkflowGraph) => {
  const { version } = useWorkflow(workflowId);
  const nodeTypes = useWorkflowNodeTypes();
  const savedGraph = useMemo(
    () => toStableJson(toWorkflowGraph(toCanvasNodes(version.nodes, nodeTypes), toCanvasEdges(version.connections), nodeTypes)),
    [version, nodeTypes],
  );

  return toStableJson(graph) !== savedGraph;
};
