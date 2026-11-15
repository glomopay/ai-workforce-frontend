import { UIMessage } from 'ai';

import { NodeParameters } from './workflow-editor.types';

// Outputs are port names (true/false, each/done) or indexes; the backend resolves them from the node type.
export type AssistantOutput = string | number;

// Mirrors the backend's editWorkflow input schema (workflow-assistant/engine/workflow-operations.ts).
export type AssistantOperation =
  | {
      action: 'addNode';
      payload: { name: string; type: string; parameters?: NodeParameters; appendLocation?: { existingNode: string; outputPort?: AssistantOutput } };
    }
  | { action: 'updateParameters'; payload: { nodeName: string; set?: NodeParameters; unset?: string[] } }
  | { action: 'renameNode'; payload: { nodeName: string; newName: string } }
  | { action: 'removeNode'; payload: { nodeName: string } }
  | { action: 'connect'; payload: { connectionStartNodeName: string; output?: AssistantOutput; connectionEndNodeName: string } }
  | { action: 'disconnect'; payload: { connectionStartNodeName: string; output?: AssistantOutput; connectionEndNodeName: string } };

export type AssistantOperationKind = AssistantOperation['action'];

// The output is text written for the model; a rejected batch arrives as a tool error.
export type AssistantTools = {
  editWorkflow: { input: { operations: AssistantOperation[] }; output: string };
};

// The backend sets workflowVersion on the finish chunk of a turn that saved one. `stopped` is set on this client only,
// for a turn the user stopped, which the backend neither saves nor stores.
export interface AssistantMessageMetadata {
  workflowVersion?: { id: string; number: number };
  stopped?: boolean;
}

export type AssistantMessage = UIMessage<AssistantMessageMetadata, never, AssistantTools>;

export type AssistantPart = AssistantMessage['parts'][number];

export type EditWorkflowPart = Extract<AssistantPart, { type: 'tool-editWorkflow' }>;

export type NodeChangeKind = 'added' | 'changed';

// What the latest assistant turn or restore did to the canvas, keyed by the version it loaded.
export interface CanvasChanges {
  versionId: string;
  nodes: Map<string, NodeChangeKind>;
  edges: Set<string>;
}
