import { describe, expect, it } from 'vitest';

import { describeOperation, summarizeOperations } from './assistant-operations';

describe('describeOperation', () => {
  it('labels an added node and where it goes', () => {
    expect(
      describeOperation({
        action: 'addNode',
        payload: { name: 'Get Ticket', type: 'zohoDesk', appendLocation: { existingNode: 'Zoho Desk Trigger' } },
      }),
    ).toEqual({ verb: 'Add', text: 'Get Ticket after Zoho Desk Trigger' });
  });

  it('lists the keys a parameter update sets and resets', () => {
    expect(describeOperation({ action: 'updateParameters', payload: { nodeName: 'Slack', set: { channelId: 'C123' }, unset: ['text'] } })).toEqual({
      verb: 'Set',
      text: 'channelId, text on Slack',
    });
  });

  it('names the output a link leaves from', () => {
    expect(
      describeOperation({ action: 'connect', payload: { connectionStartNodeName: 'If', output: 'true', connectionEndNodeName: 'Slack' } }),
    ).toEqual({ verb: 'Link', text: 'If (true) → Slack' });
  });

  it('waits until a streaming operation names its nodes', () => {
    expect(describeOperation({ action: 'connect', payload: { connectionStartNodeName: 'If' } })).toBeUndefined();
    expect(describeOperation({ action: 'addNode' })).toBeUndefined();
    expect(describeOperation({})).toBeUndefined();
  });
});

describe('summarizeOperations', () => {
  it('counts operations by kind', () => {
    expect(
      summarizeOperations([
        { action: 'addNode', payload: { name: 'A', type: 'slack' } },
        { action: 'addNode', payload: { name: 'B', type: 'slack' } },
        { action: 'connect', payload: { connectionStartNodeName: 'A', connectionEndNodeName: 'B' } },
      ]),
    ).toEqual(['2 nodes added', '1 link']);
  });
});
