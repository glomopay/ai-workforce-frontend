import { WORKFLOW_CREDENTIALS_ENDPOINTS } from '../constants/workflow-credentials.constants';
import { OAuth2CredentialTarget } from '../types/workflow-credentials.types';

// A page navigation, not a fetch: the backend sends the browser to Google and back to `returnTo`.
export const buildOAuth2StartUrl = (target: OAuth2CredentialTarget, returnTo: string): string =>
  `${WORKFLOW_CREDENTIALS_ENDPOINTS.OAUTH2_START}?${new URLSearchParams({ ...target, returnTo })}`;
