import { Edge, Node } from '@xyflow/react';

export type WorkflowPortKind = 'main';

export interface WorkflowPort {
  kind: WorkflowPortKind;
  name?: string;
}

export type WorkflowNodeGroup = 'trigger' | 'controlFlow' | 'transform' | 'action';

export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;

export type JsonObject = { [key: string]: JsonValue };

export type NodeParameters = Record<string, JsonValue>;

export interface NodePropertyOption {
  name: string;
  value: string;
  description?: string;
  action?: string;
}

interface BaseNodeProperty {
  name: string;
  displayName: string;
  required?: boolean;
  description?: string;
  displayOptions?: { show: Record<string, string[]> };
}

export interface StringNodeProperty extends BaseNodeProperty {
  type: 'string';
  default: string;
  placeholder?: string;
  noDataExpression?: boolean;
  typeOptions?: { rows?: number };
}

export interface OptionsNodeProperty extends BaseNodeProperty {
  type: 'options';
  default: string;
  options: NodePropertyOption[];
}

export interface JsonNodeProperty extends BaseNodeProperty {
  type: 'json';
  default: JsonObject;
  placeholder?: string;
}

export type NodeProperty = StringNodeProperty | OptionsNodeProperty | JsonNodeProperty;

// Keyed by credential type. Only the id is stored; names come from GET /workflow-credentials.
export type NodeCredentials = Record<string, { id: string }>;

export interface WorkflowNodeType {
  type: string;
  version: number;
  displayName: string;
  description: string;
  group: WorkflowNodeGroup;
  icon: string;
  defaults: { name: string };
  maxNodes?: number;
  inputs: WorkflowPort[];
  outputs: WorkflowPort[];
  properties: NodeProperty[];
  credentials?: { name: string }[];
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: NodeParameters;
  credentials: NodeCredentials;
}

export interface WorkflowConnection {
  kind: WorkflowPortKind;
  sourceNodeId: string;
  sourceOutput: number;
  targetNodeId: string;
  targetInput: number;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

export interface WorkflowVersion extends WorkflowGraph {
  id: string;
  number: number;
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  latestVersion: number;
  activeVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  version: WorkflowVersion;
}

export interface SaveWorkflowInput extends WorkflowGraph {
  baseVersionId: string;
}

export interface UpdateWorkflowInput {
  name: string;
  description: string;
}

export type WorkflowErrorResponse =
  | {
      statusCode: number;
      message: string;
      errorCode: 'WORKFLOW_NOT_FOUND' | 'WORKFLOW_VERSION_CONFLICT' | 'WORKFLOW_VERSION_NOT_FOUND' | 'WORKFLOW_CREDENTIAL_NOT_FOUND';
    }
  | { statusCode: number; message: string; errorCode: 'INVALID_WORKFLOW_GRAPH' | 'WORKFLOW_HAS_ISSUES'; errors: string[] };

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export type CanvasNode = Node<Pick<WorkflowNode, 'name' | 'type' | 'typeVersion' | 'parameters' | 'credentials'>, 'workflowNode'>;

export type CanvasEdge = Edge<{ kind: WorkflowPortKind }>;

export interface PaletteEntry {
  key: string;
  label: string;
  description: string;
  nodeName: string;
  parameters: NodeParameters;
}
