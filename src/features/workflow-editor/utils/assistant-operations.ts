import { DeepPartial } from 'ai';

import { AssistantOperation, AssistantOperationKind, AssistantOutput } from '../types/workflow-assistant.types';

export interface OperationLabel {
  verb: string;
  text: string;
}

const withOutput = (from: string, output: AssistantOutput | undefined) => (output === undefined ? from : `${from} (${output})`);

// Tool input streams in token by token, so an operation is labelled only once the fields it names have arrived.
export const describeOperation = (operation: DeepPartial<AssistantOperation>): OperationLabel | undefined => {
  switch (operation.op) {
    case 'addNode':
      return operation.name
        ? { verb: 'Add', text: operation.after?.node ? `${operation.name} after ${operation.after.node}` : operation.name }
        : undefined;
    case 'updateParameters': {
      const keys = [...Object.keys(operation.set ?? {}), ...(operation.unset ?? [])];
      return operation.node && keys.length ? { verb: 'Set', text: `${keys.join(', ')} on ${operation.node}` } : undefined;
    }
    case 'renameNode':
      return operation.node && operation.to ? { verb: 'Rename', text: `${operation.node} → ${operation.to}` } : undefined;
    case 'removeNode':
      return operation.node ? { verb: 'Remove', text: operation.node } : undefined;
    case 'connect':
      return operation.from && operation.to ? { verb: 'Link', text: `${withOutput(operation.from, operation.output)} → ${operation.to}` } : undefined;
    case 'disconnect':
      return operation.from && operation.to
        ? { verb: 'Unlink', text: `${withOutput(operation.from, operation.output)} → ${operation.to}` }
        : undefined;
    default:
      return undefined;
  }
};

const KIND_LABELS: Record<AssistantOperationKind, [string, string]> = {
  addNode: ['node added', 'nodes added'],
  updateParameters: ['node edit', 'node edits'],
  renameNode: ['rename', 'renames'],
  removeNode: ['node removed', 'nodes removed'],
  connect: ['link', 'links'],
  disconnect: ['unlink', 'unlinks'],
};

export const summarizeOperations = (operations: AssistantOperation[]): string[] => {
  const counts = new Map<AssistantOperationKind, number>();
  operations.forEach(({ op }) => counts.set(op, (counts.get(op) ?? 0) + 1));
  return [...counts].map(([op, count]) => `${count} ${KIND_LABELS[op][count === 1 ? 0 : 1]}`);
};
