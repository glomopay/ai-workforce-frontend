import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { credentialsQueryOptions } from '../apis/workflow-credentials.queries';
import { OAuth2ErrorToast } from '../components/oauth2-error-toast';
import { OAuth2Result } from '../types/workflow-credentials.types';

// The list is refetched before onConnected runs, so a picker never sees the new id before the credential behind it.
export const useOAuth2ResultHandler = () => {
  const queryClient = useQueryClient();

  return async (result: OAuth2Result, onConnected?: (credentialId: string) => void) => {
    await queryClient.invalidateQueries({ queryKey: credentialsQueryOptions.queryKey });
    if (result.status === 'connected') onConnected?.(result.credentialId);
    else toast.custom(() => <OAuth2ErrorToast reason={result.reason} />, { id: `oauth2-${result.reason}` });
  };
};
