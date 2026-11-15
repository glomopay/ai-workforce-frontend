import { FC } from 'react';
import { CornerDownLeft } from 'lucide-react';

const DELAY_CLASSES = ['delay-500', 'delay-700', 'delay-1000'];

interface AssistantStarterPromptProps {
  index: number;
  prompt: string;
  onPick: (prompt: string) => void;
}

export const AssistantStarterPrompt: FC<AssistantStarterPromptProps> = ({ index, prompt, onPick }) => (
  <button
    type='button'
    onClick={() => onPick(prompt)}
    className={`bg-background/40 hover:border-primary-soft/50 hover:bg-primary/10 hover:shadow-primary/30 group animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-xs leading-snug transition-all duration-500 hover:shadow-[0_0_20px] ${DELAY_CLASSES[index]}`}>
    <span className='text-primary-soft mt-px font-mono text-[10px] tracking-widest'>{String(index + 1).padStart(2, '0')}</span>
    <span className='text-muted-foreground group-hover:text-foreground flex-1 transition-colors'>{prompt}</span>
    <CornerDownLeft className='text-primary-soft mt-px size-3 opacity-0 transition-opacity group-hover:opacity-100' />
  </button>
);
