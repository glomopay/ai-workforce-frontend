import { FC } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { ReconnectCredentialButton } from './reconnect-credential-button';
import { credentialsQueryOptions } from '../apis/workflow-credentials.queries';
import { useOAuth2CredentialFlow } from '../hooks/use-oauth2-credential-flow';

interface ReconnectNeededCredentialsProps {
  credentialIds: string[];
  fallbackReturnTo: string;
}

// Node-run errors carry only a message, so a failed run refetches the list on mount and offers to reconnect any of
// the node's credentials Google stopped accepting.
export const ReconnectNeededCredentials: FC<ReconnectNeededCredentialsProps> = ({ credentialIds, fallbackReturnTo }) => {
  const credentials = useSuspenseQuery({ ...credentialsQueryOptions, refetchOnMount: 'always' }).data;
  const startFlow = useOAuth2CredentialFlow(fallbackReturnTo);

  return credentials
    .filter(({ id, status }) => credentialIds.includes(id) && status === 'NEEDS_RECONNECT')
    .map(({ id, name }) => <ReconnectCredentialButton key={id} label={`Reconnect ${name}`} onClick={() => startFlow({ credentialId: id })} />);
};
