import { FC, ReactNode } from 'react';

import { Sidebar } from './sidebar';

import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface AppLayoutProps {
  children: ReactNode;
}

// The page scrolls inside the content column with the app's scrollbar, so the sidebar stays in place.
export const AppLayout: FC<AppLayoutProps> = ({ children }) => (
  <div className='flex h-dvh'>
    <Sidebar />
    <ScrollArea className='min-w-0 flex-1'>
      <main>{children}</main>
    </ScrollArea>
  </div>
);
