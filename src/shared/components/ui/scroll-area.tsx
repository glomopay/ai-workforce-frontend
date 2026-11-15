import * as React from 'react';
import { cn } from 'cn';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

// Customised: the viewport ref is exposed for scroll pinning, and Radix's display:table content wrapper is made a
// block so wide or truncated children wrap to the viewport instead of scrolling sideways.
function ScrollArea({
  className,
  children,
  viewportRef,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & { viewportRef?: React.Ref<HTMLDivElement> }) {
  return (
    <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot='scroll-area-viewport'
        className='focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:block!'>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

// Customised: a glowing indigo thumb with a light sweeping through it, which fades in while scrolling or hovering
// and widens under the pointer.
function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot='scroll-area-scrollbar'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/scrollbar data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out relative z-10 flex touch-none p-0.5 transition-[width,height] duration-300 select-none data-horizontal:h-2 data-horizontal:flex-col data-horizontal:hover:h-3 data-vertical:h-full data-vertical:w-2 data-vertical:hover:w-3',
        'before:bg-primary-soft/10 before:absolute before:inset-y-2 before:left-1/2 before:w-px before:-translate-x-1/2 data-horizontal:before:hidden',
        className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot='scroll-area-thumb'
        className='from-primary-soft to-primary group-hover/scrollbar:shadow-primary relative flex-1 overflow-hidden rounded-full bg-linear-to-b shadow-[0_0_10px] shadow-transparent transition-shadow duration-300'>
        <span className='animate-shimmer-y absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-transparent via-white/70 to-transparent' />
      </ScrollAreaPrimitive.ScrollAreaThumb>
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
