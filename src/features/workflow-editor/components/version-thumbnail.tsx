import { FC } from 'react';

import { CANVAS_NODE_SIZE, VERSION_THUMBNAIL_SIZE } from '../constants/workflow-editor.constants';
import { useWorkflowVersion } from '../hooks/use-workflow-version';

const { width: WIDTH, height: HEIGHT, padding: PADDING } = VERSION_THUMBNAIL_SIZE;

interface VersionThumbnailProps {
  workflowId: string;
  versionId: string;
}

// A minimap of the saved graph: node centres scaled into the card, edges as horizontal curves.
export const VersionThumbnail: FC<VersionThumbnailProps> = ({ workflowId, versionId }) => {
  const { nodes, connections } = useWorkflowVersion(workflowId, versionId);
  const xs = nodes.map(({ position: [x] }) => x + CANVAS_NODE_SIZE / 2);
  const ys = nodes.map(({ position: [, y] }) => y + CANVAS_NODE_SIZE / 2);
  const scale = Math.min(
    (WIDTH - PADDING * 2) / Math.max(Math.max(...xs) - Math.min(...xs), 1),
    (HEIGHT - PADDING * 2) / Math.max(Math.max(...ys) - Math.min(...ys), 1),
    0.12,
  );
  const offsetX = WIDTH / 2 - ((Math.max(...xs) + Math.min(...xs)) / 2) * scale;
  const offsetY = HEIGHT / 2 - ((Math.max(...ys) + Math.min(...ys)) / 2) * scale;
  const centres = new Map(nodes.map(({ id }, index) => [id, { x: xs[index] * scale + offsetX, y: ys[index] * scale + offsetY }]));

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className='bg-background/70 h-16 w-28 shrink-0 rounded-md border' aria-hidden>
      {connections.map(({ sourceNodeId, sourceOutput, targetNodeId, targetInput }) => {
        const source = centres.get(sourceNodeId);
        const target = centres.get(targetNodeId);
        if (!source || !target) return null;
        const bend = (target.x - source.x) / 2;
        return (
          <path
            key={`${sourceNodeId}:${sourceOutput}->${targetNodeId}:${targetInput}`}
            d={`M${source.x} ${source.y} C${source.x + bend} ${source.y} ${target.x - bend} ${target.y} ${target.x} ${target.y}`}
            pathLength={1}
            strokeDasharray={1}
            fill='none'
            className='stroke-primary-soft/50 animate-draw'
          />
        );
      })}
      {[...centres].map(([id, { x, y }]) => (
        <rect
          key={id}
          x={x - 3.5}
          y={y - 3.5}
          width={7}
          height={7}
          rx={2}
          className='fill-card stroke-primary-soft drop-shadow-[0_0_3px_var(--primary)]'
        />
      ))}
    </svg>
  );
};
