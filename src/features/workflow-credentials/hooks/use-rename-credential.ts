import { useMutation, useQueryClient } from '@tanstack/react-query';

import { renameCredential } from '../apis/workflow-credentials.api';
import { credentialsQueryOptions } from '../apis/workflow-credentials.queries';

export const useRenameCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ credentialId, name }: { credentialId: string; name: string }) => renameCredential(credentialId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: credentialsQueryOptions.queryKey }),
  });
};
