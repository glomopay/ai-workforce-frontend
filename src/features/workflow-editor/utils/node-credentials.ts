import { NodeCredentials, WorkflowNodeType } from '../types/workflow-editor.types';

// Every credential a node type lists is required. One that is unset, or whose credential was deleted, is missing:
// the backend blocks runs on the first and fails them on the second.
export const findMissingCredentials = (nodeType: WorkflowNodeType, credentials: NodeCredentials, existingIds: Set<string>): string[] =>
  (nodeType.credentials ?? []).map(({ name }) => name).filter((name) => !(name in credentials) || !existingIds.has(credentials[name].id));

// The backend rejects a credential type the node type doesn't declare.
export const toSavedCredentials = (nodeType: WorkflowNodeType, credentials: NodeCredentials): NodeCredentials =>
  Object.fromEntries((nodeType.credentials ?? []).flatMap(({ name }) => (name in credentials ? [[name, credentials[name]]] : [])));
