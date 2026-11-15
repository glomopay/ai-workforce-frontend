import { useQueryClient } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';

import { useWorkflowNodeTypes } from './use-workflow-node-types';
import { workflowQueryOptions } from '../apis/workflow-editor.queries';
import { FIT_VIEW_OPTIONS } from '../constants/workflow-editor.constants';
import { CanvasChanges } from '../types/workflow-assistant.types';
import { CanvasEdge, CanvasNode, Workflow } from '../types/workflow-editor.types';
import { findCanvasChanges } from '../utils/canvas-changes';
import { makeRoomForAddedNodes } from '../utils/make-room-for-added-nodes';
import { toCanvasEdges, toCanvasNodes } from '../utils/workflow-graph';

import { workflowsQueryOptions } from '@/features/workflows/public';

// Loads a version saved off the canvas (by the assistant or a restore) and marks what it changed.
export const useShowSavedWorkflow = (workflowId: string, onChanges: (changes: CanvasChanges) => void) => {
  const queryClient = useQueryClient();
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow<CanvasNode, CanvasEdge>();
  const nodeTypes = useWorkflowNodeTypes();

  return (workflow: Workflow) => {
    queryClient.setQueryData(workflowQueryOptions(workflowId).queryKey, workflow);
    void queryClient.invalidateQueries({ queryKey: workflowsQueryOptions.queryKey });
    const selectedIds = new Set(getNodes().flatMap((node) => (node.selected ? [node.id] : [])));
    const nodes = toCanvasNodes(workflow.version.nodes, nodeTypes).map((node) => ({ ...node, selected: selectedIds.has(node.id) }));
    const edges = toCanvasEdges(workflow.version.connections);
    const changes = findCanvasChanges(workflow.version.id, { nodes: getNodes(), edges: getEdges() }, { nodes, edges }, nodeTypes);
    const addedIds = [...changes.nodes].flatMap(([id, kind]) => (kind === 'added' ? [id] : []));
    onChanges(changes);
    // Moved nodes differ from the saved version, so the editor shows them as unsaved until the user saves.
    setNodes(makeRoomForAddedNodes(nodes, edges, addedIds));
    setEdges(edges);
    void fitView({ ...FIT_VIEW_OPTIONS, duration: 800 });
  };
};
