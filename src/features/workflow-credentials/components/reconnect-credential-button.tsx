import { FC } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface ReconnectCredentialButtonProps {
  label: string;
  onClick: () => void;
}

export const ReconnectCredentialButton: FC<ReconnectCredentialButtonProps> = ({ label, onClick }) => (
  <Button variant='outline' size='sm' className='border-destructive/40 self-start' onClick={onClick}>
    <RefreshCw className='text-destructive' />
    {label}
  </Button>
);
