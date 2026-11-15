import { UIMessage } from 'ai';

import { NodeParameters } from './workflow-editor.types';

// Outputs are port names (true/false, each/done) or indexes; the backend resolves them from the node type.
export type AssistantOutput = string | number;

export type AssistantOperation =
  | { op: 'addNode'; name: string; type: string; parameters?: NodeParameters; after?: { node: string; output?: AssistantOutput } }
  | { op: 'updateParameters'; node: string; set: NodeParameters; unset?: string[] }
  | { op: 'renameNode'; node: string; to: string }
  | { op: 'removeNode'; node: string }
  | { op: 'connect'; from: string; output?: AssistantOutput; to: string }
  | { op: 'disconnect'; from: string; output?: AssistantOutput; to: string };

export type AssistantOperationKind = AssistantOperation['op'];

export type AssistantTools = {
  edit_workflow: { input: { operations: AssistantOperation[] }; output: unknown };
  view_workflow: { input: Record<string, never>; output: unknown };
  get_node_output_schema: { input: { node: string }; output: unknown };
};

export type AssistantDataParts = {
  'workflow-version': { versionId: string; number: number };
};

// `stopped` is set on this client only, for a turn the user stopped; the backend saves nothing for those.
export type AssistantMessage = UIMessage<{ stopped?: boolean }, AssistantDataParts, AssistantTools>;

export type AssistantPart = AssistantMessage['parts'][number];

export type NodeChangeKind = 'added' | 'changed';

// What the latest assistant turn or restore did to the canvas, keyed by the version it loaded.
export interface CanvasChanges {
  versionId: string;
  nodes: Map<string, NodeChangeKind>;
  edges: Set<string>;
}
