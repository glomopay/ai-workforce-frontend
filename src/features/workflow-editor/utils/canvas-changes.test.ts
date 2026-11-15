import { describe, expect, it } from 'vitest';

import { findCanvasChanges } from './canvas-changes';
import { CanvasEdge, CanvasNode, WorkflowNodeType } from '../types/workflow-editor.types';

const NODE_TYPES: WorkflowNodeType[] = [
  {
    type: 'slack',
    version: 1,
    displayName: 'Slack',
    description: '',
    group: 'action',
    icon: 'slack',
    defaults: { name: 'Slack' },
    inputs: [{ kind: 'main' }],
    outputs: [{ kind: 'main' }],
    properties: [{ name: 'channel', displayName: 'Channel', type: 'string', default: '' }],
  },
];

const node = (id: string, name: string, channel = '', x = 0): CanvasNode => ({
  id,
  type: 'workflowNode',
  position: { x, y: 0 },
  data: { name, type: 'slack', typeVersion: 1, parameters: { channel } },
});

const edge = (id: string, source: string, target: string): CanvasEdge => ({ id, source, sourceHandle: '0', target, targetHandle: '0' });

describe('findCanvasChanges', () => {
  it('marks new nodes as added and edited ones as changed, ignoring moves', () => {
    const before = { nodes: [node('a', 'A'), node('b', 'B')], edges: [] };
    const after = { nodes: [node('a', 'A', '', 200), node('b', 'B', 'C123'), node('c', 'C')], edges: [] };

    expect(findCanvasChanges('v2', before, after, NODE_TYPES).nodes).toEqual(
      new Map([
        ['b', 'changed'],
        ['c', 'added'],
      ]),
    );
  });

  it('matches edges by their ends, not their ids', () => {
    const before = { nodes: [], edges: [edge('xy-edge__a0-b0', 'a', 'b')] };
    const after = { nodes: [], edges: [edge('a:0->b:0', 'a', 'b'), edge('b:0->c:0', 'b', 'c')] };

    expect(findCanvasChanges('v2', before, after, NODE_TYPES).edges).toEqual(new Set(['b:0->c:0']));
  });
});
