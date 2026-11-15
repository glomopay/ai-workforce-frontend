import { FC, Suspense } from 'react';

import { AssistantTodos } from './assistant-todos';
import { RestoreVersionDialog } from './restore-version-dialog';
import { VersionThumbnail } from './version-thumbnail';
import { VersionThumbnailLoading } from './version-thumbnail-loading';
import { useWorkflow } from '../hooks/use-workflow';
import { AssistantOperation } from '../types/workflow-assistant.types';
import { summarizeOperations } from '../utils/assistant-operations';

import { cn } from '@/shared/utils/cn';

interface AssistantVersionCardProps {
  workflowId: string;
  versionId: string;
  number: number;
  operations: AssistantOperation[];
}

export const AssistantVersionCard: FC<AssistantVersionCardProps> = ({ workflowId, versionId, number, operations }) => {
  const isOnCanvas = useWorkflow(workflowId).version.id === versionId;

  return (
    <div
      className={cn(
        'bg-background/50 animate-in fade-in zoom-in-95 relative flex flex-col gap-2.5 rounded-lg border p-3 duration-500',
        isOnCanvas ? 'border-beam border-primary-soft/30 shadow-primary/30 shadow-[0_0_24px]' : 'border-border',
      )}>
      <div className='flex items-center gap-3'>
        <Suspense fallback={<VersionThumbnailLoading />}>
          <VersionThumbnail workflowId={workflowId} versionId={versionId} />
        </Suspense>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>Version {number} saved</span>
          <span className='text-muted-foreground text-xs leading-snug'>{summarizeOperations(operations).join(' · ') || 'Workflow updated'}</span>
          {isOnCanvas ? (
            <span className='text-muted-foreground flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase'>
              <span className='bg-primary-soft size-1.5 rounded-full shadow-[0_0_6px_var(--primary-soft)]' />
              On canvas
            </span>
          ) : (
            <RestoreVersionDialog workflowId={workflowId} versionId={versionId} number={number} />
          )}
        </div>
      </div>
      {isOnCanvas && <AssistantTodos />}
    </div>
  );
};
