import { FC, useState } from 'react';
import { Pencil } from 'lucide-react';

import { WorkflowDetailsForm } from './workflow-details-form';
import { useWorkflow } from '../hooks/use-workflow';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

interface WorkflowDetailsPopoverProps {
  workflowId: string;
}

export const WorkflowDetailsPopover: FC<WorkflowDetailsPopoverProps> = ({ workflowId }) => {
  const [open, setOpen] = useState(false);
  const { name, description } = useWorkflow(workflowId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='flex flex-col'>
        <span className='text-muted-foreground font-mono text-[10px] tracking-widest uppercase'>Workflow</span>
        <h1 className='text-sm font-semibold tracking-tight'>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='-mx-1.5 h-auto max-w-72 px-1.5 py-0.5 font-semibold' title={description || undefined}>
              <span className='truncate'>{name}</span>
              <Pencil className='text-primary-soft size-3 opacity-0 transition-opacity group-hover/button:opacity-100 group-focus-visible/button:opacity-100' />
            </Button>
          </PopoverTrigger>
        </h1>
      </div>
      <PopoverContent align='start' className='w-96 p-4'>
        <WorkflowDetailsForm workflowId={workflowId} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
