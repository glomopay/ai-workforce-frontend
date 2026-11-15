import { describe, expect, it } from 'vitest';

import { parseJsonObject, toJsonText, toStableJson } from './json-object';

describe('parseJsonObject', () => {
  it('parses an object', () => {
    expect(parseJsonObject('{ "a": [1, { "b": null }] }')).toEqual({ a: [1, { b: null }] });
  });

  it('reads empty text as an empty object', () => {
    expect(parseJsonObject('  \n')).toEqual({});
  });

  it('rejects a top level that is not an object', () => {
    expect(() => parseJsonObject('[1,2]')).toThrow('The top level must be an object');
    expect(() => parseJsonObject('null')).toThrow('The top level must be an object');
    expect(() => parseJsonObject('"text"')).toThrow('The top level must be an object');
  });

  it('rejects invalid JSON', () => {
    expect(() => parseJsonObject('{ "a": }')).toThrow(SyntaxError);
  });
});

describe('toJsonText', () => {
  it('shows an empty object as empty text', () => {
    expect(toJsonText({})).toBe('');
    expect(toJsonText({ a: 1 })).toBe('{\n  "a": 1\n}');
  });
});

describe('toStableJson', () => {
  it('ignores object key order at any depth but keeps list order', () => {
    expect(toStableJson({ b: 1, a: { d: [2, 1], c: 0 } })).toBe(toStableJson({ a: { c: 0, d: [2, 1] }, b: 1 }));
    expect(toStableJson([1, 2])).not.toBe(toStableJson([2, 1]));
  });
});
