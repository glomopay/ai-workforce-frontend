import { FC } from 'react';
import { useNodes } from '@xyflow/react';
import { Crosshair } from 'lucide-react';

import { CanvasNode } from '../types/workflow-editor.types';

// Selected nodes go with the message, so "this node" means what is selected when it is sent.
export const AssistantContextChip: FC = () => {
  const selected = useNodes<CanvasNode>().filter((node) => node.selected);
  if (!selected.length) return null;

  return (
    <span className='border-primary-soft/30 bg-primary/10 text-muted-foreground animate-in fade-in slide-in-from-bottom-1 flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase duration-300'>
      <Crosshair className='text-primary-soft size-3' />
      In context ·
      <span className='text-foreground max-w-48 truncate normal-case'>
        {selected.length === 1 ? selected[0].data.name : `${selected.length} nodes`}
      </span>
    </span>
  );
};
