import { describe, expect, it } from 'vitest';

import { makeRoomForAddedNodes } from './make-room-for-added-nodes';
import { CanvasEdge, CanvasNode } from '../types/workflow-editor.types';

const node = (id: string, x: number, y = 0): CanvasNode => ({
  id,
  type: 'workflowNode',
  position: { x, y },
  data: { name: id, type: 'slack', typeVersion: 1, parameters: {} },
});

const edge = (source: string, target: string): CanvasEdge => ({ id: `${source}->${target}`, source, target });

const xsOf = (nodes: CanvasNode[]) => Object.fromEntries(nodes.map(({ id, position }) => [id, position.x]));

describe('makeRoomForAddedNodes', () => {
  it('pushes the chain after an inserted node one column right', () => {
    const nodes = [node('trigger', 0), node('ticket', 200), node('if', 400), node('slack', 400), node('tag', 600)];
    const edges = [edge('trigger', 'ticket'), edge('ticket', 'if'), edge('if', 'slack'), edge('slack', 'tag')];

    expect(xsOf(makeRoomForAddedNodes(nodes, edges, ['if']))).toEqual({ trigger: 0, ticket: 200, if: 400, slack: 600, tag: 800 });
  });

  it('leaves nodes that already sit far enough right, and nodes not fed by an added node', () => {
    const nodes = [node('if', 400), node('slack', 900), node('other', 100)];
    const edges = [edge('if', 'slack'), edge('other', 'if')];

    expect(xsOf(makeRoomForAddedNodes(nodes, edges, ['if']))).toEqual({ if: 400, slack: 900, other: 100 });
  });
});
