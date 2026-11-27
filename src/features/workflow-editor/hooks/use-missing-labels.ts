import { useSuspenseQuery } from '@tanstack/react-query';

import { CanvasNode, WorkflowNodeType } from '../types/workflow-editor.types';
import { findMissingCredentials } from '../utils/node-credentials';
import { findMissingProperties } from '../utils/node-parameters';

import { credentialsQueryOptions, findCredentialType, useCredentialTypes } from '@/features/workflow-credentials/public';

// What the node still needs before it can run: required fields, then accounts.
export const useMissingLabels = (nodeType: WorkflowNodeType, data: CanvasNode['data']): string[] => {
  const credentialTypes = useCredentialTypes();
  const existingIds = new Set(useSuspenseQuery(credentialsQueryOptions).data.map(({ id }) => id));

  return [
    ...findMissingProperties(nodeType.properties, data.parameters).map(({ displayName }) => displayName),
    ...findMissingCredentials(nodeType, data.credentials, existingIds).map(
      (name) => `${findCredentialType(credentialTypes, name).displayName} account`,
    ),
  ];
};
