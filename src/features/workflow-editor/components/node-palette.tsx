import { FC, useState } from 'react';

import { NodePaletteActions } from './node-palette-actions';
import { NodePaletteGroup } from './node-palette-group';
import { NODE_GROUP_LABELS } from '../constants/workflow-editor.constants';
import { useWorkflowNodeTypes } from '../hooks/use-workflow-node-types';
import { WorkflowNodeType } from '../types/workflow-editor.types';

export const NodePalette: FC = () => {
  const nodeTypes = useWorkflowNodeTypes();
  const [openNodeType, setOpenNodeType] = useState<WorkflowNodeType | null>(null);

  return (
    <aside className='bg-sidebar animate-in fade-in slide-in-from-right-2 fill-mode-both flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l p-4 duration-500'>
      {openNodeType ? (
        <NodePaletteActions nodeType={openNodeType} onBack={() => setOpenNodeType(null)} />
      ) : (
        <>
          <div className='flex flex-col gap-1'>
            <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>Node palette</span>
            <span className='text-muted-foreground text-xs'>Drag a node onto the canvas, or open an app to pick an action.</span>
          </div>
          {/* A backend older than this editor serves no node for some groups, so empty groups are left out. */}
          {Object.entries(NODE_GROUP_LABELS)
            .map(([group, label]) => ({ group, label, groupTypes: nodeTypes.filter((nodeType) => nodeType.group === group) }))
            .filter(({ groupTypes }) => groupTypes.length > 0)
            .map(({ group, label, groupTypes }) => (
              <NodePaletteGroup key={group} label={label} nodeTypes={groupTypes} onOpen={setOpenNodeType} />
            ))}
        </>
      )}
    </aside>
  );
};
