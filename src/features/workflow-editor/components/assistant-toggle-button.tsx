import { FC } from 'react';
import { Sparkles } from 'lucide-react';

import { useIsAssistantBusy } from '../hooks/use-is-assistant-busy';
import { useWorkflowAssistant } from '../hooks/use-workflow-assistant';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

export const AssistantToggleButton: FC = () => {
  const { isOpen, setIsOpen } = useWorkflowAssistant();
  const isBusy = useIsAssistantBusy();

  return (
    <Button
      variant='outline'
      aria-pressed={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      className={cn('border-primary-soft/40 relative', isOpen && 'bg-primary/20 shadow-primary/40 shadow-[0_0_14px]', isBusy && 'border-beam')}>
      <Sparkles className={cn('text-primary-soft', isBusy && 'animate-pulse')} />
      Assistant
    </Button>
  );
};
