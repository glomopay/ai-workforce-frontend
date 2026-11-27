import { useSuspenseQuery } from '@tanstack/react-query';

import { credentialTypesQueryOptions } from '../apis/workflow-credentials.queries';

export const useCredentialTypes = () => useSuspenseQuery(credentialTypesQueryOptions).data;
