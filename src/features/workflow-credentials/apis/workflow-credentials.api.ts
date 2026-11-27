import { WORKFLOW_CREDENTIALS_ENDPOINTS } from '../constants/workflow-credentials.constants';
import { WorkflowCredential, WorkflowCredentialType } from '../types/workflow-credentials.types';

export const fetchCredentialTypes = async (): Promise<WorkflowCredentialType[]> => {
  const response = await fetch(WORKFLOW_CREDENTIALS_ENDPOINTS.TYPES, { credentials: 'include' });
  if (!response.ok) throw new Error(`GET ${WORKFLOW_CREDENTIALS_ENDPOINTS.TYPES} failed with ${response.status}`);
  const { credentialTypes } = await response.json();
  return credentialTypes;
};

export const fetchCredentials = async (): Promise<WorkflowCredential[]> => {
  const response = await fetch(WORKFLOW_CREDENTIALS_ENDPOINTS.CREDENTIALS, { credentials: 'include' });
  if (!response.ok) throw new Error(`GET ${WORKFLOW_CREDENTIALS_ENDPOINTS.CREDENTIALS} failed with ${response.status}`);
  const { credentials } = await response.json();
  return credentials;
};

export const renameCredential = async (credentialId: string, name: string): Promise<WorkflowCredential> => {
  const url = WORKFLOW_CREDENTIALS_ENDPOINTS.CREDENTIAL(credentialId);
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (response.status === 404) throw new Error('This account no longer exists.');
  if (!response.ok) throw new Error(`PATCH ${url} failed with ${response.status}`);
  return response.json();
};

// A 404 means it is already gone, which is what the user asked for.
export const deleteCredential = async (credentialId: string): Promise<void> => {
  const url = WORKFLOW_CREDENTIALS_ENDPOINTS.CREDENTIAL(credentialId);
  const response = await fetch(url, { method: 'DELETE', credentials: 'include' });
  if (!response.ok && response.status !== 404) throw new Error(`DELETE ${url} failed with ${response.status}`);
};
