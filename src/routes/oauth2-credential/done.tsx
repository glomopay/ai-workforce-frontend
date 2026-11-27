import { createFileRoute } from '@tanstack/react-router';

import { OAuth2CredentialDonePage, OAuth2FlowMessage, parseOAuth2ReturnParams } from '@/features/workflow-credentials/public';

export const Route = createFileRoute('/oauth2-credential/done')({
  validateSearch: (search): Partial<OAuth2FlowMessage> => ({
    flow: typeof search.flow === 'string' ? search.flow : undefined,
    ...parseOAuth2ReturnParams(search),
  }),
  component: OAuth2CredentialDonePage,
});
