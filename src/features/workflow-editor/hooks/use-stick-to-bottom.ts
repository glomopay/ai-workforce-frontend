import { useEffect, useRef } from 'react';

import { STICK_TO_BOTTOM_THRESHOLD } from '../constants/workflow-editor.constants';

// Follows a streaming thread while the reader is at the bottom; scrolling up stops it, and a new message resumes it.
export const useStickToBottom = (messageCount: number) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) throw new Error('useStickToBottom refs are not attached');
    // Content growing between our scroll and its event would read as scrolling away, so only scrolling up unpins.
    let lastScrollTop = viewport.scrollTop;
    const onScroll = () => {
      if (viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < STICK_TO_BOTTOM_THRESHOLD) isPinnedRef.current = true;
      else if (viewport.scrollTop < lastScrollTop) isPinnedRef.current = false;
      lastScrollTop = viewport.scrollTop;
    };
    const observer = new ResizeObserver(() => {
      if (isPinnedRef.current) viewport.scrollTop = viewport.scrollHeight;
    });
    viewport.addEventListener('scroll', onScroll, { passive: true });
    observer.observe(content);
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    isPinnedRef.current = true;
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [messageCount]);

  return { viewportRef, contentRef };
};
