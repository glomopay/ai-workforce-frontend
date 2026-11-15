import { FC } from 'react';

import { JsonNode } from './json-node';
import { NodeData } from '../types/workflow-execution.types';
import { toJsonEntries } from '../utils/json-tree';

import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface JsonBlockProps {
  label: string;
  value: NodeData;
}

export const JsonBlock: FC<JsonBlockProps> = ({ label, value }) => (
  <section className='flex flex-col gap-1.5'>
    <span className='text-muted-foreground font-mono text-[10px] tracking-widest uppercase'>{label}</span>
    <ScrollArea horizontal viewportClassName='max-h-112' className='bg-background/60 rounded-lg border font-mono text-[11px] leading-relaxed'>
      <div className='p-2'>
        {toJsonEntries(value).map(([key, child]) => (
          <JsonNode key={key} name={key} value={child} depth={0} />
        ))}
      </div>
    </ScrollArea>
  </section>
);
