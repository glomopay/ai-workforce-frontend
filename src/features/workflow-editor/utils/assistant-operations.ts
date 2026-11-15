import { DeepPartial } from 'ai';

import { AssistantOperation, AssistantOperationKind, AssistantOutput } from '../types/workflow-assistant.types';

export interface OperationLabel {
  verb: string;
  text: string;
}

const withOutput = (from: string, output: AssistantOutput | undefined) => (output === undefined ? from : `${from} (${output})`);

// Tool input streams in token by token, so an operation is labelled only once the fields it names have arrived.
export const describeOperation = (operation: DeepPartial<AssistantOperation>): OperationLabel | undefined => {
  switch (operation.action) {
    case 'addNode': {
      const { name, appendLocation } = operation.payload ?? {};
      if (!name) return undefined;
      return { verb: 'Add', text: appendLocation?.existingNode ? `${name} after ${appendLocation.existingNode}` : name };
    }
    case 'updateParameters': {
      const { nodeName, set, unset } = operation.payload ?? {};
      const keys = [...Object.keys(set ?? {}), ...(unset ?? [])];
      return nodeName && keys.length ? { verb: 'Set', text: `${keys.join(', ')} on ${nodeName}` } : undefined;
    }
    case 'renameNode': {
      const { nodeName, newName } = operation.payload ?? {};
      return nodeName && newName ? { verb: 'Rename', text: `${nodeName} → ${newName}` } : undefined;
    }
    case 'removeNode':
      return operation.payload?.nodeName ? { verb: 'Remove', text: operation.payload.nodeName } : undefined;
    case 'connect':
    case 'disconnect': {
      const { connectionStartNodeName: from, output, connectionEndNodeName: to } = operation.payload ?? {};
      if (!from || !to) return undefined;
      return { verb: operation.action === 'connect' ? 'Link' : 'Unlink', text: `${withOutput(from, output)} → ${to}` };
    }
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
  operations.forEach(({ action }) => counts.set(action, (counts.get(action) ?? 0) + 1));
  return [...counts].map(([action, count]) => `${count} ${KIND_LABELS[action][count === 1 ? 0 : 1]}`);
};
