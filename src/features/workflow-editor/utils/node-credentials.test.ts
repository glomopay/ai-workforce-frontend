import { describe, expect, it } from 'vitest';

import { findMissingCredentials, toSavedCredentials } from './node-credentials';
import { WorkflowNodeType } from '../types/workflow-editor.types';

const GOOGLE_SHEETS: WorkflowNodeType = {
  type: 'googleSheets',
  version: 1,
  displayName: 'Google Sheets',
  description: '',
  group: 'action',
  icon: 'google-sheets',
  defaults: { name: 'Google Sheets' },
  inputs: [{ kind: 'main' }],
  outputs: [{ kind: 'main' }],
  properties: [],
  credentials: [{ name: 'googleSheetsOAuth2Api' }],
};

const SLACK: WorkflowNodeType = { ...GOOGLE_SHEETS, type: 'slack', credentials: undefined };

describe('findMissingCredentials', () => {
  it('reports each declared credential type that is unset or whose credential was deleted', () => {
    const existingIds = new Set(['c1']);

    expect(findMissingCredentials(GOOGLE_SHEETS, {}, existingIds)).toEqual(['googleSheetsOAuth2Api']);
    expect(findMissingCredentials(GOOGLE_SHEETS, { googleSheetsOAuth2Api: { id: 'c1' } }, existingIds)).toEqual([]);
    expect(findMissingCredentials(GOOGLE_SHEETS, { googleSheetsOAuth2Api: { id: 'gone' } }, existingIds)).toEqual(['googleSheetsOAuth2Api']);
    expect(findMissingCredentials(SLACK, {}, existingIds)).toEqual([]);
  });
});

describe('toSavedCredentials', () => {
  it('keeps only credential types the node type declares', () => {
    expect(toSavedCredentials(GOOGLE_SHEETS, { googleSheetsOAuth2Api: { id: 'c1' }, other: { id: 'c2' } })).toEqual({
      googleSheetsOAuth2Api: { id: 'c1' },
    });
    expect(toSavedCredentials(SLACK, { other: { id: 'c2' } })).toEqual({});
  });
});
