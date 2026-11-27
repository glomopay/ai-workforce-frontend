import { FC, ReactNode } from 'react';

interface CredentialNoticeProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export const CredentialNotice: FC<CredentialNoticeProps> = ({ title, children, action }) => (
  <div className='border-destructive/40 bg-destructive/5 animate-in fade-in slide-in-from-top-1 flex flex-col gap-2 rounded-lg border p-3'>
    <span className='text-destructive flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase'>
      <span className='bg-destructive size-1.5 animate-pulse rounded-full' />
      {title}
    </span>
    <p className='text-xs leading-snug'>{children}</p>
    {action}
  </div>
);
