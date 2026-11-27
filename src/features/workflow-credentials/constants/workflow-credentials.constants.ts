export const WORKFLOW_CREDENTIALS_ENDPOINTS = {
  TYPES: '/workflow-credential-types',
  CREDENTIALS: '/workflow-credentials',
  CREDENTIAL: (credentialId: string) => `/workflow-credentials/${credentialId}`,
  OAUTH2_START: '/auth/oauth2-credential/start',
};

export const WORKFLOW_CREDENTIALS_QUERY_KEYS = {
  TYPES: ['workflow-credential-types'],
  CREDENTIALS: ['workflow-credentials'],
};

// The popup lands here, relays the result on the channel and closes.
export const OAUTH2_DONE_PATH = '/oauth2-credential/done';

export const OAUTH2_CHANNEL_NAME = 'oauth2-credential';

export const OAUTH2_POPUP_FEATURES = 'popup,width=520,height=680';

// Matches the backend's rename DTO: trimmed, 1–128 characters.
export const CREDENTIAL_NAME_MAX_LENGTH = 128;

// A Select item value that starts the connect flow instead of picking a credential.
export const CONNECT_NEW_VALUE = '__connect-new__';

export const OAUTH2_ERROR_MESSAGES: Record<string, string> = {
  OAUTH2_CONSENT_DENIED: 'You cancelled on the Google screen, so nothing was connected.',
  OAUTH2_ACCOUNT_DOMAIN_NOT_ALLOWED: 'That Google account is outside the Glomo Workspace. Connect your work account.',
  OAUTH2_SCOPE_NOT_GRANTED: 'Google didn’t grant every permission. Connect again and leave every permission ticked.',
  WORKFLOW_CREDENTIAL_NOT_FOUND: 'That account was deleted, so it can’t be reconnected. Connect a new one.',
};

export const OAUTH2_FALLBACK_ERROR_MESSAGE = 'The connection didn’t complete. Try again.';
