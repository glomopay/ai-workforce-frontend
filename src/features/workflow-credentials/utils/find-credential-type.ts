import { WorkflowCredentialType } from '../types/workflow-credentials.types';

export const findCredentialType = (credentialTypes: WorkflowCredentialType[], name: string): WorkflowCredentialType => {
  const credentialType = credentialTypes.find((candidate) => candidate.name === name);
  if (!credentialType) throw new Error(`Unknown credential type ${name}`);
  return credentialType;
};
