import { queryOptions } from '@tanstack/react-query';

import { fetchCredentials, fetchCredentialTypes } from './workflow-credentials.api';
import { WORKFLOW_CREDENTIALS_QUERY_KEYS } from '../constants/workflow-credentials.constants';

export const credentialTypesQueryOptions = queryOptions({
  queryKey: WORKFLOW_CREDENTIALS_QUERY_KEYS.TYPES,
  queryFn: fetchCredentialTypes,
  staleTime: Infinity,
});

// One list for every type: pickers filter it, and a status flipped to NEEDS_RECONNECT by a run shows on the next refetch.
export const credentialsQueryOptions = queryOptions({
  queryKey: WORKFLOW_CREDENTIALS_QUERY_KEYS.CREDENTIALS,
  queryFn: fetchCredentials,
});
