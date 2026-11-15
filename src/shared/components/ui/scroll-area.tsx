import * as React from 'react';
import { cn } from 'cn';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

// Customised: the viewport ref and class are exposed (pinning, max heights), a horizontal bar is opt-in, and Radix's
// display:table content wrapper is made a block so content wraps to the viewport instead of widening it.
function ScrollArea({
  className,
  children,
  viewportRef,
  viewportClassName,
  horizontal = false,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportRef?: React.Ref<HTMLDivElement>;
  viewportClassName?: string;
  horizontal?: boolean;
}) {
  return (
    <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot='scroll-area-viewport'
        className={cn(
          'focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:block!',
          viewportClassName,
        )}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      {horizontal && <ScrollBar orientation='horizontal' />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

// Customised: a glowing indigo thumb with a light sweeping along it, which fades in while scrolling or hovering
// and thickens under the pointer.
function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  const isVertical = orientation === 'vertical';

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot='scroll-area-scrollbar'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/scrollbar data-[state=visible]:animate-in data-[state=visible]:fade-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out relative z-10 flex touch-none p-0.5 transition-[width,height] duration-300 select-none data-horizontal:h-2 data-horizontal:flex-col data-horizontal:hover:h-3 data-vertical:h-full data-vertical:w-2 data-vertical:hover:w-3',
        'before:bg-primary-soft/10 before:absolute data-horizontal:before:inset-x-2 data-horizontal:before:top-1/2 data-horizontal:before:h-px data-horizontal:before:-translate-y-1/2 data-vertical:before:inset-y-2 data-vertical:before:left-1/2 data-vertical:before:w-px data-vertical:before:-translate-x-1/2',
        className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot='scroll-area-thumb'
        className={cn(
          'from-primary-soft to-primary group-hover/scrollbar:shadow-primary relative flex-1 overflow-hidden rounded-full shadow-[0_0_10px] shadow-transparent transition-shadow duration-300',
          isVertical ? 'bg-linear-to-b' : 'bg-linear-to-r',
        )}>
        <span
          className={cn(
            'absolute from-transparent via-white/70 to-transparent',
            isVertical ? 'animate-shimmer-y inset-x-0 top-0 h-1/2 bg-linear-to-b' : 'animate-shimmer inset-y-0 left-0 w-1/3 bg-linear-to-r',
          )}
        />
      </ScrollAreaPrimitive.ScrollAreaThumb>
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
