import { FC, use } from 'react';

import { CanvasChangesContext } from '../contexts/canvas-changes.context';

interface NodeChangeMarkerProps {
  nodeId: string;
}

// Keyed by version so the marks replay when a later turn changes the same node again.
export const NodeChangeMarker: FC<NodeChangeMarkerProps> = ({ nodeId }) => {
  const changes = use(CanvasChangesContext);
  const kind = changes?.nodes.get(nodeId);
  if (!changes || !kind) return null;

  return (
    <span key={changes.versionId} className='animate-change-flash pointer-events-none absolute -inset-2 rounded-[inherit]'>
      <span className='border-primary-soft shadow-primary absolute inset-0 rounded-[inherit] border shadow-[0_0_32px]' />
      <span className='border-primary-soft animate-ring-burst absolute inset-0 rounded-[inherit] border [animation-iteration-count:3]' />
      <span className='bg-background border-primary-soft/60 text-primary-soft absolute -top-5 left-1/2 -translate-x-1/2 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase shadow-[0_0_12px_var(--primary)]'>
        {kind === 'added' ? 'New' : 'Edited'}
      </span>
    </span>
  );
};
