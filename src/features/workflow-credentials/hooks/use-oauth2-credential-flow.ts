import { useOAuth2ResultHandler } from './use-oauth2-result-handler';
import { OAUTH2_CHANNEL_NAME, OAUTH2_DONE_PATH, OAUTH2_POPUP_FEATURES } from '../constants/workflow-credentials.constants';
import { OAuth2CredentialTarget, OAuth2FlowMessage } from '../types/workflow-credentials.types';
import { buildOAuth2StartUrl } from '../utils/build-oauth2-start-url';
import { toOAuth2Result } from '../utils/oauth2-return-params';

// Google runs in a popup so unsaved editor state survives. Each flow has its own id, so a popup the user abandoned never
// answers for a later one. A blocked popup falls back to leaving the page, and `fallbackReturnTo` handles the result.
export const useOAuth2CredentialFlow = (fallbackReturnTo: string) => {
  const handleResult = useOAuth2ResultHandler();

  return (target: OAuth2CredentialTarget, onConnected?: (credentialId: string) => void) => {
    const flow = crypto.randomUUID();
    const popup = window.open(buildOAuth2StartUrl(target, `${OAUTH2_DONE_PATH}?flow=${flow}`), OAUTH2_CHANNEL_NAME, OAUTH2_POPUP_FEATURES);
    if (!popup) {
      window.location.assign(buildOAuth2StartUrl(target, fallbackReturnTo));
      return;
    }
    const channel = new BroadcastChannel(OAUTH2_CHANNEL_NAME);
    channel.onmessage = ({ data }: MessageEvent<OAuth2FlowMessage>) => {
      if (data.flow !== flow) return;
      channel.close();
      void handleResult(toOAuth2Result(data), onConnected);
    };
  };
};
