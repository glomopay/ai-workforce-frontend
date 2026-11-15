import { FC } from 'react';

export const VersionThumbnailLoading: FC = () => (
  <span className='bg-background/70 relative h-16 w-28 shrink-0 overflow-hidden rounded-md border'>
    <span className='animate-shimmer via-primary-soft/15 absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent to-transparent' />
  </span>
);
