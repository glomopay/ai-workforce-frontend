import { describe, expect, it } from 'vitest';

import { describeLatestStep, findAppliedOperations, findBatchErrors, isRejectedBatch, toReplyBlocks } from './reply-blocks';
import { AssistantPart, EditWorkflowPart } from '../types/workflow-assistant.types';

const REJECTED: EditWorkflowPart = {
  type: 'tool-editWorkflow',
  toolCallId: 'bad',
  state: 'output-available',
  input: { operations: [{ action: 'removeNode', payload: { nodeName: 'Slack' } }] },
  output: 'Nothing was applied; the workflow is unchanged.\nErrors:\n- Unknown node "Slack"\n- Second problem',
};

const APPLIED: EditWorkflowPart = {
  type: 'tool-editWorkflow',
  toolCallId: 'good',
  state: 'output-available',
  input: { operations: [{ action: 'addNode', payload: { name: 'Slack', type: 'slack' } }] },
  output: 'Applied.\nNo run blockers.\n\nWorkflow now:\n…',
};

const PARTS: AssistantPart[] = [
  { type: 'step-start' },
  { type: 'reasoning', text: 'Thinking it over', state: 'done' },
  REJECTED,
  APPLIED,
  { type: 'text', text: 'Added Slack.' },
];

describe('toReplyBlocks', () => {
  it('groups consecutive edits, keeps text apart and leaves reasoning out', () => {
    expect(toReplyBlocks(PARTS).map(({ kind, key }) => [kind, key])).toEqual([
      ['steps', 'bad'],
      ['text', 'text-4'],
    ]);
  });
});

describe('rejected batches', () => {
  it('are told apart from applied ones by their output', () => {
    expect(isRejectedBatch(REJECTED)).toBe(true);
    expect(isRejectedBatch(APPLIED)).toBe(false);
  });

  it('list the errors from their output', () => {
    expect(findBatchErrors(REJECTED)).toEqual(['Unknown node "Slack"', 'Second problem']);
  });

  it('are left out of the applied operations', () => {
    expect(findAppliedOperations(PARTS)).toEqual([{ action: 'addNode', payload: { name: 'Slack', type: 'slack' } }]);
  });
});

describe('describeLatestStep', () => {
  it('labels the last operation of the last edit', () => {
    expect(describeLatestStep(PARTS)).toEqual({ verb: 'Add', text: 'Slack' });
  });
});
