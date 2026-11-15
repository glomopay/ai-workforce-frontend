import { FC, use } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

import { CanvasChangesContext } from '../contexts/canvas-changes.context';
import { useWorkflowRun } from '../hooks/use-workflow-run';
import { CanvasEdge } from '../types/workflow-editor.types';
import { toEdgeKey } from '../utils/canvas-changes';
import { isExecutionFinished } from '../utils/execution-status';

import { cn } from '@/shared/utils/cn';

export const WorkflowEdge: FC<EdgeProps<CanvasEdge>> = ({
  id,
  source,
  sourceHandleId,
  target,
  targetHandleId,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  interactionWidth,
}) => {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const { execution, runsByNode } = useWorkflowRun();
  const isFinished = execution !== undefined && isExecutionFinished(execution.status);
  // Node runs don't record which output fired, so an edge carried data when the nodes at both ends ran.
  const hasFired = isFinished && runsByNode.has(source) && runsByNode.has(target);
  const changes = use(CanvasChangesContext);
  const isNew = changes?.edges.has(toEdgeKey({ source, sourceHandle: sourceHandleId, target, targetHandle: targetHandleId }));

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        interactionWidth={interactionWidth}
        className={cn(
          'transition-opacity duration-500',
          isFinished && !hasFired && 'opacity-20',
          hasFired && 'stroke-primary-soft! stroke-2! drop-shadow-[0_0_6px_var(--primary-soft)]',
        )}
      />
      {hasFired && (
        <circle r='3' className='fill-foreground drop-shadow-[0_0_6px_var(--primary-soft)]'>
          <animateMotion dur='1.8s' repeatCount='indefinite' path={path} />
        </circle>
      )}
      {changes && isNew && (
        <g key={changes.versionId} className='animate-change-flash'>
          <path
            d={path}
            pathLength={1}
            strokeDasharray={1}
            fill='none'
            className='stroke-primary-soft animate-draw stroke-2 drop-shadow-[0_0_6px_var(--primary-soft)]'
          />
          <circle r='3' className='fill-foreground drop-shadow-[0_0_6px_var(--primary-soft)]'>
            <animateMotion dur='1.4s' repeatCount='3' fill='freeze' path={path} />
          </circle>
        </g>
      )}
    </>
  );
};
