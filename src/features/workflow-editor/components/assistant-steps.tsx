import { FC } from 'react';
import { getToolName } from 'ai';

import { AssistantEditStep } from './assistant-edit-step';
import { AssistantStep, StepState } from './assistant-step';
import { ASSISTANT_TOOL_LABELS } from '../constants/workflow-editor.constants';
import { ReplyBlock } from '../utils/reply-blocks';

type ToolPart = Extract<ReplyBlock, { kind: 'steps' }>['parts'][number];

// A call still without output once its turn has ended was cut off, and nothing from that turn was saved.
const toStepState = (part: ToolPart, isLive: boolean): StepState => {
  if (part.state === 'output-available') return 'done';
  if (part.state === 'output-error' || part.state === 'output-denied') return 'failed';
  return isLive ? 'pending' : 'stopped';
};

interface AssistantStepsProps {
  parts: ToolPart[];
  isLive: boolean;
}

// A rolled-back edit batch changed nothing, so its operations show struck through with the reason under them.
export const AssistantSteps: FC<AssistantStepsProps> = ({ parts, isLive }) => (
  <ul className='border-primary-soft/20 ml-1 flex flex-col border-l'>
    {parts.map((part) => {
      const state = toStepState(part, isLive);
      if (part.type === 'tool-edit_workflow') {
        return [
          ...(part.input?.operations ?? []).map(
            (operation, index) => operation && <AssistantEditStep key={`${part.toolCallId}-${index}`} operation={operation} state={state} />,
          ),
          part.state === 'output-error' && (
            <li key={`${part.toolCallId}-error`} className='text-destructive py-1 pl-4 text-xs leading-snug'>
              Rolled back, nothing changed: {part.errorText}
            </li>
          ),
        ];
      }
      const toolName = getToolName(part);
      const node = part.type === 'tool-get_node_output_schema' ? part.input?.node : undefined;
      return (
        <AssistantStep key={part.toolCallId} state={state} verb='Read'>
          {ASSISTANT_TOOL_LABELS[toolName] ?? toolName}
          {node && <span className='text-muted-foreground'> · {node}</span>}
        </AssistantStep>
      );
    })}
  </ul>
);
