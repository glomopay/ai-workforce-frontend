import { FC } from 'react';
import { DeepPartial } from 'ai';

import { AssistantStep, StepState } from './assistant-step';
import { NodeTypeIcon } from './node-type-icon';
import { useWorkflowNodeTypes } from '../hooks/use-workflow-node-types';
import { AssistantOperation } from '../types/workflow-assistant.types';
import { describeOperation } from '../utils/assistant-operations';

interface AssistantEditStepProps {
  operation: DeepPartial<AssistantOperation>;
  state: StepState;
}

export const AssistantEditStep: FC<AssistantEditStepProps> = ({ operation, state }) => {
  const nodeTypes = useWorkflowNodeTypes();
  const label = describeOperation(operation);
  if (!label) return null;
  const icon = operation.action === 'addNode' ? nodeTypes.find(({ type }) => type === operation.payload?.type)?.icon : undefined;

  return (
    <AssistantStep state={state} verb={label.verb} icon={icon && <NodeTypeIcon icon={icon} className='text-primary-soft size-3.5 shrink-0' />}>
      {label.text}
    </AssistantStep>
  );
};
