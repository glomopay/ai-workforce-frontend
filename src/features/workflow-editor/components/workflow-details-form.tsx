import { FC, FormEvent } from 'react';

import { useUpdateWorkflow } from '../hooks/use-update-workflow';
import { useWorkflow } from '../hooks/use-workflow';

import { ValidationError, WORKFLOW_DESCRIPTION_MAX_LENGTH, WORKFLOW_NAME_MAX_LENGTH } from '@/features/workflows/public';
import { PulseSpinner } from '@/shared/components/public';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

interface WorkflowDetailsFormProps {
  workflowId: string;
  onDone: () => void;
}

// Name and description aren't versioned, so saving them leaves the canvas and its unsaved changes alone.
export const WorkflowDetailsForm: FC<WorkflowDetailsFormProps> = ({ workflowId, onDone }) => {
  const workflow = useWorkflow(workflowId);
  const { mutate: updateWorkflow, isPending, error } = useUpdateWorkflow(workflowId);
  const fieldErrors = error instanceof ValidationError ? error.fieldErrors : {};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name'));
    const description = String(formData.get('description'));
    if (name === workflow.name && description === (workflow.description ?? '')) return onDone();
    updateWorkflow({ name, description }, { onSuccess: onDone });
  };

  return (
    <form className='grid gap-4' onSubmit={handleSubmit}>
      <span className='text-primary-soft font-mono text-[10px] tracking-widest uppercase'>Workflow details</span>
      <div className='grid gap-2'>
        <Label htmlFor='workflow-details-name'>Name</Label>
        <Input
          id='workflow-details-name'
          name='name'
          maxLength={WORKFLOW_NAME_MAX_LENGTH}
          autoFocus
          defaultValue={workflow.name}
          aria-invalid={!!fieldErrors.name}
        />
        {fieldErrors.name && <p className='text-destructive text-xs'>{fieldErrors.name[0]}</p>}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='workflow-details-description'>
          Description <span className='text-muted-foreground font-normal'>(optional)</span>
        </Label>
        <Textarea
          id='workflow-details-description'
          name='description'
          rows={3}
          maxLength={WORKFLOW_DESCRIPTION_MAX_LENGTH}
          defaultValue={workflow.description ?? ''}
          placeholder='What this workflow does and when it runs.'
          aria-invalid={!!fieldErrors.description}
        />
        {fieldErrors.description && <p className='text-destructive text-xs'>{fieldErrors.description[0]}</p>}
      </div>
      <div className='flex justify-end gap-2'>
        <Button type='button' variant='ghost' size='sm' onClick={onDone}>
          Cancel
        </Button>
        <Button type='submit' size='sm' disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <>
              <PulseSpinner />
              Saving…
            </>
          ) : (
            'Save details'
          )}
        </Button>
      </div>
    </form>
  );
};
