import { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { WorkflowDetailsPopover } from './workflow-details-popover';

import { Button } from '@/shared/components/ui/button';

interface EditorTitleProps {
  workflowId: string;
}

export const EditorTitle: FC<EditorTitleProps> = ({ workflowId }) => (
  <div className='flex items-center gap-3'>
    <Button asChild variant='ghost' size='icon-sm' aria-label='Back to workflows'>
      <Link to='/workflows'>
        <ArrowLeft />
      </Link>
    </Button>
    <WorkflowDetailsPopover workflowId={workflowId} />
  </div>
);
