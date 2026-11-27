import { OAuth2Result, OAuth2ReturnParams } from '../types/workflow-credentials.types';

const toOptionalString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);

export const parseOAuth2ReturnParams = (search: Record<string, unknown>): OAuth2ReturnParams => ({
  oauth: toOptionalString(search.oauth),
  credentialId: toOptionalString(search.credentialId),
  reason: toOptionalString(search.reason),
});

export const toOAuth2Result = ({ oauth, credentialId, reason }: OAuth2ReturnParams): OAuth2Result =>
  oauth === 'connected' && credentialId ? { status: 'connected', credentialId } : { status: 'error', reason: reason ?? 'UNKNOWN' };
