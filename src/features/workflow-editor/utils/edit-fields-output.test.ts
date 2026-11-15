import { describe, expect, it } from 'vitest';

import { toEditFieldsOutput } from './edit-fields-output';
import { LookupScope } from './parameter-lookups';

const scope: LookupScope = { input: { x: 1, meta: { a: 1, b: 2 } }, nodeOutput: () => undefined };

describe('toEditFieldsOutput', () => {
  it('outputs only the resolved fields, leaving out the input record', () => {
    expect(toEditFieldsOutput({ output: { y: '={{ $json.x }}', fixed: 'v' } }, scope)).toEqual({ y: 1, fixed: 'v' });
  });
});
