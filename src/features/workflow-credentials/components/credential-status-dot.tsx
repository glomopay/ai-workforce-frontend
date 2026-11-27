import { FC } from 'react';

import { WorkflowCredentialStatus } from '../types/workflow-credentials.types';

import { cn } from '@/shared/utils/cn';

interface CredentialStatusDotProps {
  status: WorkflowCredentialStatus;
}

export const CredentialStatusDot: FC<CredentialStatusDotProps> = ({ status }) => (
  <span
    className={cn(
      'size-1.5 shrink-0 rounded-full',
      status === 'CONNECTED' ? 'bg-primary-soft shadow-[0_0_6px_var(--primary-soft)]' : 'bg-destructive animate-pulse',
    )}
  />
);
