import { FC } from 'react';
import { useNodes } from '@xyflow/react';

import { useFocusNode } from '../hooks/use-focus-node';
import { useWorkflowNodeTypes } from '../hooks/use-workflow-node-types';
import { CanvasNode } from '../types/workflow-editor.types';
import { findNodeType, hasNodeType } from '../utils/find-node-type';
import { findMissingProperties } from '../utils/node-parameters';

import { Button } from '@/shared/components/ui/button';

// Read off the canvas rather than the reply, so the list stays true as the user fills fields in.
export const AssistantTodos: FC = () => {
  const nodeTypes = useWorkflowNodeTypes();
  const focusNode = useFocusNode();
  const todos = useNodes<CanvasNode>().flatMap(({ id, data }) =>
    hasNodeType(nodeTypes, data.type, data.typeVersion)
      ? findMissingProperties(findNodeType(nodeTypes, data.type, data.typeVersion).properties, data.parameters).map((property) => ({
          key: `${id}:${property.name}`,
          nodeId: id,
          label: `${data.name} › ${property.displayName}`,
        }))
      : [],
  );

  if (!todos.length) {
    return (
      <span className='text-muted-foreground flex items-center gap-2 border-t pt-2.5 font-mono text-[10px] tracking-widest uppercase'>
        <span className='bg-primary-soft size-1.5 rounded-full' />
        All required fields set
      </span>
    );
  }

  return (
    <div className='flex flex-col gap-1.5 border-t pt-2.5'>
      <span className='text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase'>
        <span className='bg-destructive size-1.5 animate-pulse rounded-full' />
        {todos.length} required {todos.length === 1 ? 'field' : 'fields'} for you to fill
      </span>
      <ul className='flex flex-col'>
        {todos.map(({ key, nodeId, label }) => (
          <li key={key}>
            <Button
              variant='link'
              className='text-foreground hover:text-primary-soft h-auto p-0 text-left text-xs font-normal whitespace-normal'
              onClick={() => focusNode(nodeId)}>
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
