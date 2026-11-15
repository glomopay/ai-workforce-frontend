import { ASSISTANT_LAYOUT_COLUMN_WIDTH } from '../constants/workflow-editor.constants';
import { CanvasEdge, CanvasNode } from '../types/workflow-editor.types';

// The backend places an inserted node one column after the node it hangs off, which can land on the node that edge
// already led to. Nodes downstream of an added node move right until each sits a column past what feeds it;
// nothing else moves, so the user's own layout stays. The graph is acyclic, so the walk ends.
export const makeRoomForAddedNodes = (nodes: CanvasNode[], edges: CanvasEdge[], addedIds: string[]): CanvasNode[] => {
  const xs = new Map(nodes.map(({ id, position }) => [id, position.x]));
  const queue = [...addedIds];
  for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
    const minX = (xs.get(id) ?? 0) + ASSISTANT_LAYOUT_COLUMN_WIDTH;
    edges
      .filter(({ source, target }) => source === id && (xs.get(target) ?? minX) < minX)
      .forEach(({ target }) => {
        xs.set(target, minX);
        queue.push(target);
      });
  }
  return nodes.map((node) =>
    xs.get(node.id) === node.position.x ? node : { ...node, position: { ...node.position, x: xs.get(node.id) ?? node.position.x } },
  );
};
