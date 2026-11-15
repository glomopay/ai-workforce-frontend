import { FC } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useEdges, useNodes } from '@xyflow/react';

import { EmptyOutput } from './empty-output';
import { JsonBlock } from './json-block';
import { nodeRunsQueryOptions } from '../apis/workflow-editor.queries';
import { useWorkflowRun } from '../hooks/use-workflow-run';
import { CanvasNode, JsonObject } from '../types/workflow-editor.types';
import { toEditFieldsOutput } from '../utils/edit-fields-output';
import { findLookupNodeNames } from '../utils/parameter-lookups';

interface EditFieldsPreviewOutputProps {
  executionId: string;
  node: CanvasNode;
}

const resolvePreview = (resolve: () => JsonObject): { output: JsonObject } | { error: string } => {
  try {
    return { output: resolve() };
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { error: error.message };
  }
};

// Resolves the live Fields against outputs from the current run: $json is the parent that ran (as in a run, the one
// whose edge started this node), and each $('Node') is that node's latest output.
export const EditFieldsPreviewOutput: FC<EditFieldsPreviewOutputProps> = ({ executionId, node }) => {
  const { runsByNode } = useWorkflowRun();
  const nodes = useNodes<CanvasNode>();
  const edges = useEdges();
  const parent = nodes.find(({ id }) => runsByNode.has(id) && edges.some((edge) => edge.source === id && edge.target === node.id));
  const referenced = findLookupNodeNames(node.data.parameters.output).flatMap((name) => nodes.filter(({ data }) => data.name === name));
  const sources = [...new Set([...(parent ? [parent] : []), ...referenced])].flatMap((source) => {
    const runs = runsByNode.get(source.id);
    return runs ? [{ id: source.id, name: source.data.name, runs }] : [];
  });
  const results = useSuspenseQueries({ queries: sources.map(({ id, runs }) => nodeRunsQueryOptions(executionId, id, runs)) });
  const outputs = new Map(
    sources.map(({ name }, index) => [name, results[index].data.findLast(({ output }) => output !== null)?.output ?? undefined]),
  );
  const preview = resolvePreview(() =>
    toEditFieldsOutput(node.data.parameters, { input: parent && outputs.get(parent.data.name), nodeOutput: (name) => outputs.get(name) }),
  );

  return (
    <div className='flex flex-col gap-1.5'>
      {'error' in preview ? (
        <section className='flex flex-col gap-1.5'>
          <span className='text-muted-foreground font-mono text-[10px] tracking-widest uppercase'>Output preview</span>
          <p className='text-destructive border-destructive/40 bg-destructive/5 rounded-lg border p-3 text-xs leading-snug wrap-break-word whitespace-pre-wrap'>
            {preview.error}
          </p>
        </section>
      ) : Object.keys(preview.output).length ? (
        <JsonBlock label='Output preview' value={preview.output} />
      ) : (
        <EmptyOutput label='Output preview' message='No fields' />
      )}
      <p className='text-muted-foreground text-xs leading-snug'>
        {parent
          ? `Resolved with this run's data. $json is ${parent.data.name}'s output.`
          : "Resolved with this run's data. No parent ran, so $json is empty."}
      </p>
    </div>
  );
};
