import { FC, ReactNode, useEffect, useEffectEvent, useId, useState } from 'react';
import { Pencil } from 'lucide-react';

import { ConnectCredentialButton } from './connect-credential-button';
import { CredentialNotice } from './credential-notice';
import { CredentialRenameInput } from './credential-rename-input';
import { CredentialSelect } from './credential-select';
import { DeleteCredentialDialog } from './delete-credential-dialog';
import { ReconnectCredentialButton } from './reconnect-credential-button';
import { useCredentials } from '../hooks/use-credentials';
import { useOAuth2CredentialFlow } from '../hooks/use-oauth2-credential-flow';
import { WorkflowCredentialType } from '../types/workflow-credentials.types';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

interface CredentialPickerProps {
  credentialType: WorkflowCredentialType;
  icon: ReactNode;
  value: string | undefined;
  onChange: (credentialId: string) => void;
  fallbackReturnTo: string;
}

// Every credential a node type lists is required. With exactly one account of the type and none picked, it is picked.
export const CredentialPicker: FC<CredentialPickerProps> = ({ credentialType, icon, value, onChange, fallbackReturnTo }) => {
  const id = useId();
  const credentials = useCredentials(credentialType.name);
  const selected = credentials.find((credential) => credential.id === value);
  const startFlow = useOAuth2CredentialFlow(fallbackReturnTo);
  const [isRenaming, setIsRenaming] = useState(false);
  const onlyCredentialId = credentials.length === 1 ? credentials[0].id : undefined;
  const pickOnlyCredential = useEffectEvent(() => {
    if (value === undefined && onlyCredentialId) onChange(onlyCredentialId);
  });

  useEffect(() => pickOnlyCredential(), [value, onlyCredentialId]);

  const connect = () => startFlow({ type: credentialType.name }, onChange);

  return (
    <div className='animate-in fade-in slide-in-from-bottom-1 fill-mode-both grid gap-2 duration-300'>
      <Label htmlFor={id} className='gap-1.5'>
        {icon}
        {credentialType.displayName} account
        <span className='text-primary-soft -ml-1'>*</span>
      </Label>
      {credentials.length === 0 && value === undefined ? (
        <ConnectCredentialButton icon={icon} displayName={credentialType.displayName} onClick={connect} />
      ) : isRenaming && selected ? (
        <CredentialRenameInput credential={selected} onDone={() => setIsRenaming(false)} />
      ) : (
        <div className='flex items-center gap-1'>
          <CredentialSelect id={id} credentials={credentials} selected={selected} onPick={onChange} onConnectNew={connect} />
          {selected && (
            <>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Rename account'
                className='text-muted-foreground'
                onClick={() => setIsRenaming(true)}>
                <Pencil />
              </Button>
              <DeleteCredentialDialog credential={selected} />
            </>
          )}
        </div>
      )}
      {selected?.status === 'NEEDS_RECONNECT' && (
        <CredentialNotice
          title='Needs reconnect'
          action={<ReconnectCredentialButton label='Reconnect' onClick={() => startFlow({ credentialId: selected.id })} />}>
          Google no longer accepts this account’s access, so runs stop at this node. Reconnecting keeps it picked everywhere it is used.
        </CredentialNotice>
      )}
      {value !== undefined && !selected && (
        <CredentialNotice title='Account missing'>The account picked here was deleted. Pick another one or connect a new account.</CredentialNotice>
      )}
      {value === undefined && credentials.length > 0 && (
        <p className='text-destructive font-mono text-[10px] tracking-widest uppercase'>Required · runs are blocked until one is picked</p>
      )}
    </div>
  );
};
