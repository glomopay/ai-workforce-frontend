export interface WorkflowCredentialType {
  name: string;
  displayName: string;
  icon: string;
}

export type WorkflowCredentialStatus = 'CONNECTED' | 'NEEDS_RECONNECT';

// No token data or account email; `name` defaults to the Google account email.
export interface WorkflowCredential {
  id: string;
  name: string;
  type: string;
  status: WorkflowCredentialStatus;
  createdAt: string;
  updatedAt: string;
}

// Pass `type` to connect a new credential, or `credentialId` to reconnect one under the same id.
export type OAuth2CredentialTarget = { type: string } | { credentialId: string };

export type OAuth2Result = { status: 'connected'; credentialId: string } | { status: 'error'; reason: string };

// The query params the backend adds to `returnTo`.
export interface OAuth2ReturnParams {
  oauth?: string;
  credentialId?: string;
  reason?: string;
}

export interface OAuth2FlowMessage extends OAuth2ReturnParams {
  flow: string;
}
