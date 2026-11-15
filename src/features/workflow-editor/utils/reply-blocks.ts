import { getToolName, isToolUIPart } from 'ai';

import { describeOperation, OperationLabel } from './assistant-operations';
import { ASSISTANT_TOOL_LABELS } from '../constants/workflow-editor.constants';
import { AssistantPart } from '../types/workflow-assistant.types';

type ToolPart = Extract<AssistantPart, { toolCallId: string }>;

export type ReplyBlock =
  | { kind: 'text'; key: string; text: string }
  | { kind: 'steps'; key: string; parts: ToolPart[] }
  | { kind: 'version'; key: string; versionId: string; number: number };

// Consecutive tool calls read as one step list; text and the saved version break it.
export const toReplyBlocks = (parts: AssistantPart[]): ReplyBlock[] =>
  parts.reduce<ReplyBlock[]>((blocks, part, index) => {
    const last = blocks.at(-1);
    if (isToolUIPart(part)) {
      if (last?.kind === 'steps') last.parts.push(part);
      else blocks.push({ kind: 'steps', key: part.toolCallId, parts: [part] });
    } else if (part.type === 'text' && part.text.trim()) {
      blocks.push({ kind: 'text', key: `text-${index}`, text: part.text });
    } else if (part.type === 'data-workflow-version') {
      blocks.push({ kind: 'version', key: part.data.versionId, ...part.data });
    }
    return blocks;
  }, []);

// Every edit_workflow call that went through; a rolled-back batch changed nothing.
export const findAppliedOperations = (parts: AssistantPart[]) =>
  parts.flatMap((part) => (part.type === 'tool-edit_workflow' && part.state === 'output-available' ? part.input.operations : []));

// What the assistant is doing right now, for the canvas lock: its latest operation, or the latest tool it called.
export const describeLatestStep = (parts: AssistantPart[]): OperationLabel | undefined => {
  const part = parts.findLast(isToolUIPart);
  if (!part) return undefined;
  if (part.type === 'tool-edit_workflow')
    return (part.input?.operations ?? []).flatMap((operation) => (operation ? [describeOperation(operation)] : [])).findLast(Boolean);
  return { verb: 'Read', text: ASSISTANT_TOOL_LABELS[getToolName(part)] ?? getToolName(part) };
};
