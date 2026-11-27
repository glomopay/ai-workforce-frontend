// Where a connect flow lands when its popup is blocked: the editor, with this node's panel reopened.
export const buildNodeReturnTo = (workflowId: string, nodeId: string, credentialType?: string): string =>
  `/workflows/${workflowId}?${new URLSearchParams({ node: nodeId, ...(credentialType && { credentialType }) })}`;
