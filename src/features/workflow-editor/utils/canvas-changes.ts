import { toStableJson } from './json-object';
import { toWorkflowGraph } from './workflow-graph';
import { CanvasChanges, NodeChangeKind } from '../types/workflow-assistant.types';
import { CanvasEdge, CanvasNode, WorkflowNodeType } from '../types/workflow-editor.types';

// Edges drawn on the canvas get React Flow ids, so edges compare by their ends rather than by id.
export const toEdgeKey = ({
  source,
  sourceHandle,
  target,
  targetHandle,
}: Pick<CanvasEdge, 'source' | 'sourceHandle' | 'target' | 'targetHandle'>): string => `${source}:${sourceHandle}->${target}:${targetHandle}`;

const toComparableNode = (node: CanvasNode, nodeTypes: WorkflowNodeType[]): string => {
  const [{ name, parameters }] = toWorkflowGraph([node], [], nodeTypes).nodes;
  return toStableJson({ name, parameters });
};

export const findCanvasChanges = (
  versionId: string,
  before: { nodes: CanvasNode[]; edges: CanvasEdge[] },
  after: { nodes: CanvasNode[]; edges: CanvasEdge[] },
  nodeTypes: WorkflowNodeType[],
): CanvasChanges => {
  const nodesBefore = new Map(before.nodes.map((node) => [node.id, node]));
  const edgesBefore = new Set(before.edges.map(toEdgeKey));

  return {
    versionId,
    nodes: new Map(
      after.nodes.flatMap((node): [string, NodeChangeKind][] => {
        const previous = nodesBefore.get(node.id);
        if (!previous) return [[node.id, 'added']];
        return toComparableNode(previous, nodeTypes) === toComparableNode(node, nodeTypes) ? [] : [[node.id, 'changed']];
      }),
    ),
    edges: new Set(after.edges.map(toEdgeKey).filter((key) => !edgesBefore.has(key))),
  };
};
