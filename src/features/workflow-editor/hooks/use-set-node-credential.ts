import { useReactFlow } from '@xyflow/react';

import { CanvasNode } from '../types/workflow-editor.types';

// Reads the node's credentials when it applies, since a connect flow can finish long after it started.
export const useSetNodeCredential = () => {
  const { updateNodeData } = useReactFlow<CanvasNode>();

  return (nodeId: string, credentialType: string, credentialId: string) =>
    updateNodeData(nodeId, ({ data }) => ({ credentials: { ...data.credentials, [credentialType]: { id: credentialId } } }));
};
