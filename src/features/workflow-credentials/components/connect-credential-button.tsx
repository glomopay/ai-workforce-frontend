import { FC, ReactNode } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface ConnectCredentialButtonProps {
  icon: ReactNode;
  displayName: string;
  onClick: () => void;
}

export const ConnectCredentialButton: FC<ConnectCredentialButtonProps> = ({ icon, displayName, onClick }) => (
  <div className='border-primary-soft/30 bg-primary/5 relative flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-dashed px-4 py-5 text-center'>
    <span className='animate-sweep via-primary-soft/10 pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent to-transparent' />
    <span className='bg-secondary shadow-primary/30 flex size-10 items-center justify-center rounded-full border shadow-[0_0_24px]'>{icon}</span>
    <p className='text-muted-foreground text-xs leading-snug'>No {displayName} account connected yet.</p>
    <Button size='sm' className='shadow-primary/40 shadow-[0_0_20px]' onClick={onClick}>
      <Plus />
      Connect {displayName} account
    </Button>
    <span className='text-muted-foreground font-mono text-[10px] tracking-widest uppercase'>Opens Google in a popup</span>
  </div>
);
