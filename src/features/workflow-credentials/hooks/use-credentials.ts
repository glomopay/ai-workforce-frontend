import { useSuspenseQuery } from '@tanstack/react-query';

import { credentialsQueryOptions } from '../apis/workflow-credentials.queries';

export const useCredentials = (type: string) => useSuspenseQuery(credentialsQueryOptions).data.filter((credential) => credential.type === type);
