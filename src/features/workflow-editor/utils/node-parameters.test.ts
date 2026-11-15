import { describe, expect, it } from 'vitest';

import { findMissingProperties, isParameterEmpty } from './node-parameters';
import { NodeProperty } from '../types/workflow-editor.types';

describe('isParameterEmpty', () => {
  it('treats blank text and an object without keys as empty', () => {
    expect(isParameterEmpty('')).toBe(true);
    expect(isParameterEmpty('  ')).toBe(true);
    expect(isParameterEmpty({})).toBe(true);
    expect(isParameterEmpty(undefined)).toBe(true);
    expect(isParameterEmpty('x')).toBe(false);
    expect(isParameterEmpty({ a: null })).toBe(false);
  });
});

describe('findMissingProperties', () => {
  it('reports a required json property with no keys', () => {
    const fields: NodeProperty = { name: 'output', displayName: 'Fields', type: 'json', default: {}, required: true };

    expect(findMissingProperties([fields], { output: {} })).toEqual([fields]);
    expect(findMissingProperties([fields], { output: { a: 1 } })).toEqual([]);
  });
});
