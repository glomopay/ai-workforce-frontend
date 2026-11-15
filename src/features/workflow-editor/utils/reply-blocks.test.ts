import { describe, expect, it } from 'vitest';

import { findAppliedOperations, toReplyBlocks } from './reply-blocks';
import { AssistantPart } from '../types/workflow-assistant.types';

const PARTS: AssistantPart[] = [
  { type: 'step-start' },
  { type: 'tool-view_workflow', toolCallId: 'view', state: 'output-available', input: {}, output: '' },
  {
    type: 'tool-edit_workflow',
    toolCallId: 'bad',
    state: 'output-error',
    input: { operations: [{ op: 'removeNode', node: 'Slack' }] },
    errorText: 'Unknown node "Slack"',
  },
  {
    type: 'tool-edit_workflow',
    toolCallId: 'good',
    state: 'output-available',
    input: { operations: [{ op: 'addNode', name: 'Slack', type: 'slack' }] },
    output: '',
  },
  { type: 'text', text: 'Added Slack.' },
  { type: 'data-workflow-version', data: { versionId: 'v7', number: 7 } },
];

describe('toReplyBlocks', () => {
  it('groups consecutive tool calls and keeps text and versions apart', () => {
    expect(toReplyBlocks(PARTS).map(({ kind, key }) => [kind, key])).toEqual([
      ['steps', 'view'],
      ['text', 'text-4'],
      ['version', 'v7'],
    ]);
  });
});

describe('findAppliedOperations', () => {
  it('leaves out rolled-back batches', () => {
    expect(findAppliedOperations(PARTS)).toEqual([{ op: 'addNode', name: 'Slack', type: 'slack' }]);
  });
});
