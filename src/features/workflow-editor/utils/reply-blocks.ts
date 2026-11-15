import { describeOperation, OperationLabel } from './assistant-operations';
import { ASSISTANT_REJECTED_BATCH_PREFIX } from '../constants/workflow-editor.constants';
import { AssistantPart, EditWorkflowPart } from '../types/workflow-assistant.types';

export type ReplyBlock = { kind: 'text'; key: string; text: string } | { kind: 'steps'; key: string; parts: EditWorkflowPart[] };

// Consecutive edits read as one step list; text breaks it. Reasoning, which reloaded history includes, is left out.
export const toReplyBlocks = (parts: AssistantPart[]): ReplyBlock[] =>
  parts.reduce<ReplyBlock[]>((blocks, part, index) => {
    const last = blocks.at(-1);
    if (part.type === 'tool-editWorkflow') {
      if (last?.kind === 'steps') last.parts.push(part);
      else blocks.push({ kind: 'steps', key: part.toolCallId, parts: [part] });
    } else if (part.type === 'text' && part.text.trim()) {
      blocks.push({ kind: 'text', key: `text-${index}`, text: part.text });
    }
    return blocks;
  }, []);

// The backend rolls a failing batch back and says so in the output, which otherwise looks like any finished call.
export const isRejectedBatch = (part: EditWorkflowPart): boolean =>
  part.state === 'output-error' || (part.state === 'output-available' && part.output.startsWith(ASSISTANT_REJECTED_BATCH_PREFIX));

// A rejected batch's output lists its errors as "- " bullets after the first line.
export const findBatchErrors = (part: EditWorkflowPart): string[] => {
  if (part.state === 'output-error') return [part.errorText];
  if (part.state !== 'output-available') return [];
  return part.output.split('\n').flatMap((line) => (line.startsWith('- ') ? [line.slice(2)] : []));
};

export const findAppliedOperations = (parts: AssistantPart[]) =>
  parts.flatMap((part) =>
    part.type === 'tool-editWorkflow' && part.state === 'output-available' && !isRejectedBatch(part) ? part.input.operations : [],
  );

// The latest operation the assistant has written, for the canvas lock.
export const describeLatestStep = (parts: AssistantPart[]): OperationLabel | undefined => {
  const part = parts.findLast((candidate) => candidate.type === 'tool-editWorkflow');
  if (part?.type !== 'tool-editWorkflow') return undefined;
  return (part.input?.operations ?? []).flatMap((operation) => (operation ? [describeOperation(operation)] : [])).findLast(Boolean);
};
