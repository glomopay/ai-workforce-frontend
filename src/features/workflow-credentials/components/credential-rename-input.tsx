import { FC, KeyboardEvent } from 'react';

import { CREDENTIAL_NAME_MAX_LENGTH } from '../constants/workflow-credentials.constants';
import { useRenameCredential } from '../hooks/use-rename-credential';
import { WorkflowCredential } from '../types/workflow-credentials.types';

import { Input } from '@/shared/components/ui/input';

interface CredentialRenameInputProps {
  credential: WorkflowCredential;
  onDone: () => void;
}

// Enter and blur commit, Escape restores the name first, so blur is the one place a rename starts.
// A blank or unchanged name just closes the field.
export const CredentialRenameInput: FC<CredentialRenameInputProps> = ({ credential, onDone }) => {
  const { mutate: rename, isPending, error } = useRenameCredential();

  const commit = (input: HTMLInputElement) => {
    const name = input.value.trim();
    if (name && name !== credential.name) rename({ credentialId: credential.id, name }, { onSuccess: onDone });
    else onDone();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') event.currentTarget.value = credential.name;
    if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur();
  };

  return (
    <div className='flex flex-col gap-1.5'>
      <Input
        autoFocus
        defaultValue={credential.name}
        aria-label='Account name'
        maxLength={CREDENTIAL_NAME_MAX_LENGTH}
        spellCheck={false}
        disabled={isPending}
        onKeyDown={onKeyDown}
        onBlur={(event) => commit(event.currentTarget)}
      />
      {error ? (
        <p role='alert' className='text-destructive text-xs leading-snug'>
          {error.message}
        </p>
      ) : (
        <p className='text-muted-foreground font-mono text-[10px] tracking-widest uppercase'>Enter to rename · Esc to cancel</p>
      )}
    </div>
  );
};
