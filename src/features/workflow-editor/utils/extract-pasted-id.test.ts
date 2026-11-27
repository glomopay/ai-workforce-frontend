import { describe, expect, it } from 'vitest';

import { extractPastedId } from './extract-pasted-id';

describe('extractPastedId', () => {
  it('takes the ID out of a pasted Google Sheets URL', () => {
    expect(extractPastedId('spreadsheetId', 'https://docs.google.com/spreadsheets/d/1Bxi-MVs0_XRA5/edit#gid=0')).toBe('1Bxi-MVs0_XRA5');
  });

  it('leaves a bare ID and other fields alone', () => {
    expect(extractPastedId('spreadsheetId', '1Bxi-MVs0_XRA5')).toBeUndefined();
    expect(extractPastedId('range', 'https://docs.google.com/spreadsheets/d/1Bxi/edit')).toBeUndefined();
  });
});
