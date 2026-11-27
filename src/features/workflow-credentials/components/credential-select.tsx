import { FC } from 'react';
import { Plus } from 'lucide-react';

import { CredentialStatusDot } from './credential-status-dot';
import { CONNECT_NEW_VALUE } from '../constants/workflow-credentials.constants';
import { WorkflowCredential } from '../types/workflow-credentials.types';

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface CredentialSelectProps {
  id: string;
  credentials: WorkflowCredential[];
  selected: WorkflowCredential | undefined;
  onPick: (credentialId: string) => void;
  onConnectNew: () => void;
}

// An empty value shows the placeholder, which also covers a picked credential that was since deleted.
export const CredentialSelect: FC<CredentialSelectProps> = ({ id, credentials, selected, onPick, onConnectNew }) => (
  <Select value={selected?.id ?? ''} onValueChange={(value) => (value === CONNECT_NEW_VALUE ? onConnectNew() : onPick(value))}>
    <SelectTrigger id={id} className='min-w-0 flex-1'>
      <SelectValue placeholder='Pick an account'>
        {selected && (
          <>
            <CredentialStatusDot status={selected.status} />
            <span className='truncate'>{selected.name}</span>
          </>
        )}
      </SelectValue>
    </SelectTrigger>
    {/* nokey: the list is portalled out of the panel, and Backspace there must not delete the node. */}
    <SelectContent className='nokey'>
      {credentials.map((credential) => (
        <SelectItem key={credential.id} value={credential.id}>
          <CredentialStatusDot status={credential.status} />
          <span className='truncate'>{credential.name}</span>
          {credential.status === 'NEEDS_RECONNECT' && (
            <span className='text-destructive font-mono text-[10px] tracking-widest uppercase'>Reconnect</span>
          )}
        </SelectItem>
      ))}
      {credentials.length > 0 && <SelectSeparator />}
      <SelectItem value={CONNECT_NEW_VALUE} className='text-primary-soft'>
        <Plus className='text-primary-soft' />
        Connect new account…
      </SelectItem>
    </SelectContent>
  </Select>
);
