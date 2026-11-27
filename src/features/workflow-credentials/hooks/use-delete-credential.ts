import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCredential } from '../apis/workflow-credentials.api';
import { credentialsQueryOptions } from '../apis/workflow-credentials.queries';

export const useDeleteCredential = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: credentialsQueryOptions.queryKey }),
  });
};
