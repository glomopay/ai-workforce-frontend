import { FC, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';

import { OAUTH2_CHANNEL_NAME, OAUTH2_ERROR_MESSAGES, OAUTH2_FALLBACK_ERROR_MESSAGE } from '../constants/workflow-credentials.constants';
import { toOAuth2Result } from '../utils/oauth2-return-params';

import { CornerMarks } from '@/shared/components/public';
import { cn } from '@/shared/utils/cn';

// The popup's last stop: it hands the result to the editor that opened it and closes itself.
export const OAuth2CredentialDonePage: FC = () => {
  const search = useSearch({ from: '/oauth2-credential/done' });
  const result = toOAuth2Result(search);

  useEffect(() => {
    const channel = new BroadcastChannel(OAUTH2_CHANNEL_NAME);
    channel.postMessage(search);
    channel.close();
    window.close();
  }, [search]);

  return (
    <main className='bg-grid-glow relative flex min-h-dvh flex-col items-center justify-center gap-3 overflow-hidden p-8 text-center'>
      <CornerMarks />
      <span
        className={cn(
          'animate-in fade-in flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase',
          result.status === 'connected' ? 'text-primary-soft' : 'text-destructive',
        )}>
        <span className={cn('size-1.5 animate-pulse rounded-full', result.status === 'connected' ? 'bg-primary-soft' : 'bg-destructive')} />
        {result.status === 'connected' ? 'Account connected' : 'Account not connected'}
      </span>
      <p className='animate-in fade-in slide-in-from-bottom-2 fill-mode-both max-w-sm text-sm leading-snug delay-150 duration-500'>
        {result.status === 'connected'
          ? 'This window closes on its own. If it stays open, close it and go back to the editor.'
          : (OAUTH2_ERROR_MESSAGES[result.reason] ?? OAUTH2_FALLBACK_ERROR_MESSAGE)}
      </p>
    </main>
  );
};
