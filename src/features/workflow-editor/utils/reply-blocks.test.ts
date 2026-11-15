import { describe, expect, it } from 'vitest';

import { describeLatestStep, findAppliedOperations, findBatchErrors, toReplyBlocks } from './reply-blocks';
import { AssistantPart, EditWorkflowPart } from '../types/workflow-assistant.types';

const REJECTED: EditWorkflowPart = {
  type: 'tool-editWorkflow',
  toolCallId: 'bad',
  state: 'output-error',
  input: { operations: [{ action: 'removeNode', payload: { nodeName: 'Slack' } }] },
  errorText: 'Nothing was applied; the workflow is unchanged.\nErrors:\n- Unknown node "Slack"\n- Second problem',
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
  it('list the errors from their error text', () => {
    expect(findBatchErrors(REJECTED)).toEqual(['Unknown node "Slack"', 'Second problem']);
    expect(findBatchErrors(APPLIED)).toEqual([]);
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
