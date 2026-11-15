import { FC } from 'react';

import { AssistantEditStep } from './assistant-edit-step';
import { StepState } from './assistant-step';
import { EditWorkflowPart } from '../types/workflow-assistant.types';
import { findBatchErrors } from '../utils/reply-blocks';

// A call still without output once its turn has ended was cut off, and nothing from that turn was saved.
const toStepState = (part: EditWorkflowPart, isLive: boolean): StepState => {
  if (part.state === 'output-error') return 'failed';
  if (part.state === 'output-available') return 'done';
  return isLive ? 'pending' : 'stopped';
};

interface AssistantStepsProps {
  parts: EditWorkflowPart[];
  isLive: boolean;
}

// A rejected batch changed nothing, so its operations show struck through with the backend's reasons under them.
export const AssistantSteps: FC<AssistantStepsProps> = ({ parts, isLive }) => (
  <ul className='border-primary-soft/20 ml-1 flex flex-col border-l'>
    {parts.map((part) => {
      const state = toStepState(part, isLive);
      const errors = findBatchErrors(part);
      return [
        ...(part.input?.operations ?? []).map(
          (operation, index) => operation && <AssistantEditStep key={`${part.toolCallId}-${index}`} operation={operation} state={state} />,
        ),
        state === 'failed' && (
          <li key={`${part.toolCallId}-errors`} className='text-destructive flex flex-col gap-0.5 py-1 pl-4 text-xs leading-snug'>
            <span>Rolled back, nothing changed{errors.length ? ':' : '.'}</span>
            {errors.map((error) => (
              <span key={error}>{error}</span>
            ))}
          </li>
        ),
      ];
    })}
  </ul>
);
