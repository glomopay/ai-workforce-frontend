import { describe, expect, it } from 'vitest';

import { findLookupNodeNames, LookupScope, resolveParameterValue } from './parameter-lookups';

const scope: LookupScope = {
  input: { x: 7, payload: { ticketId: 'T-1', tags: ['a', 'b'] }, empty: null },
  nodeOutput: (nodeName) => (nodeName === 'Manual Trigger' ? { x: 'm' } : undefined),
};

describe('resolveParameterValue', () => {
  it('resolves the acceptance Fields example', () => {
    expect(
      resolveParameterValue({ ticketId: '={{ $json.x }}', n: 1, label: "=id {{ $('Manual Trigger').json.x }}", missing: '={{ $json.nope }}' }, scope),
    ).toEqual({ ticketId: 7, n: 1, label: 'id m', missing: null });
  });

  it('keeps the raw value of a lone lookup, ignoring surrounding whitespace', () => {
    expect(resolveParameterValue('={{ $json.payload }}', scope)).toEqual({ ticketId: 'T-1', tags: ['a', 'b'] });
    expect(resolveParameterValue('= {{ $json.payload.tags[1] }} ', scope)).toBe('b');
  });

  it('stringifies lookups mixed with text, with null as empty text', () => {
    expect(resolveParameterValue('=tags {{ $json.payload.tags }} / {{ $json.empty }}.', scope)).toBe('tags ["a","b"] / .');
  });

  it('resolves a missing path to null', () => {
    expect(resolveParameterValue('={{ $json.payload.nope.deeper[3] }}', scope)).toBeNull();
  });

  it('resolves template leaves at any depth, including inside lists, and leaves other values as written', () => {
    expect(resolveParameterValue({ meta: { tags: '={{ $json.payload.tags }}', list: ['={{ $json.x }}', 'plain', 2, false, null] } }, scope)).toEqual({
      meta: { tags: ['a', 'b'], list: [7, 'plain', 2, false, null] },
    });
  });

  it('never treats keys as templates', () => {
    expect(resolveParameterValue({ '={{ $json.x }}': 'v' }, scope)).toEqual({ '={{ $json.x }}': 'v' });
  });

  it('prefixes errors with the leaf path', () => {
    expect(() => resolveParameterValue({ a: { b: ['ok', "={{ $('Ghost').json.x }}"] } }, scope)).toThrow(
      'a.b[1]: node "Ghost" has not run yet in this execution',
    );
    expect(() => resolveParameterValue({ a: '={{ $json.a + 1 }}' }, scope)).toThrow(
      `a: only {{ $('Node').json.field }} and {{ $json.field }} lookups are supported, got "{{ $json.a + 1 }}"`,
    );
  });

  it('reports a $json lookup without input', () => {
    expect(() => resolveParameterValue('={{ $json.x }}', { ...scope, input: undefined })).toThrow(
      '$json has no input: this node has no parent that ran',
    );
  });
});

describe('findLookupNodeNames', () => {
  it('lists each referenced node once and skips unsupported lookups', () => {
    expect(
      findLookupNodeNames({
        a: "={{ $('Zoho').json.id }}-{{ $('Slack').json.ts }}",
        b: ["={{ $('Zoho').json.subject }}", '={{ $json.x + 1 }}'],
        c: "{{ $('Not A Template').json.x }}",
      }),
    ).toEqual(['Zoho', 'Slack']);
  });
});
