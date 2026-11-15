import { describe, expect, it } from 'vitest';

import { describeOperation, summarizeOperations } from './assistant-operations';

describe('describeOperation', () => {
  it('labels an added node and where it goes', () => {
    expect(describeOperation({ op: 'addNode', name: 'Get Ticket', type: 'zohoDesk', after: { node: 'Zoho Desk Trigger' } })).toEqual({
      verb: 'Add',
      text: 'Get Ticket after Zoho Desk Trigger',
    });
  });

  it('lists the keys a parameter update sets and clears', () => {
    expect(describeOperation({ op: 'updateParameters', node: 'Slack', set: { channel: 'C123' }, unset: ['text'] })).toEqual({
      verb: 'Set',
      text: 'channel, text on Slack',
    });
  });

  it('names the output a link leaves from', () => {
    expect(describeOperation({ op: 'connect', from: 'If', output: 'true', to: 'Slack' })).toEqual({ verb: 'Link', text: 'If (true) → Slack' });
  });

  it('waits until a streaming operation names its nodes', () => {
    expect(describeOperation({ op: 'connect', from: 'If' })).toBeUndefined();
    expect(describeOperation({})).toBeUndefined();
  });
});

describe('summarizeOperations', () => {
  it('counts operations by kind', () => {
    expect(
      summarizeOperations([
        { op: 'addNode', name: 'A', type: 'slack' },
        { op: 'addNode', name: 'B', type: 'slack' },
        { op: 'connect', from: 'A', to: 'B' },
      ]),
    ).toEqual(['2 nodes added', '1 link']);
  });
});
