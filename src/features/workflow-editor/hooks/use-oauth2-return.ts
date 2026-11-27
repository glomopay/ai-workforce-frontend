import { useEffect, useEffectEvent } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useReactFlow } from '@xyflow/react';

import { useSetNodeCredential } from './use-set-node-credential';
import { CanvasNode } from '../types/workflow-editor.types';

import { toOAuth2Result, useOAuth2ResultHandler } from '@/features/workflow-credentials/public';

// A connect flow whose popup was blocked leaves the editor and comes back here with the result in the URL:
// reopen the node's panel, apply the result like the popup would have, then strip the params.
export const useOAuth2Return = (workflowId: string) => {
  const { node, credentialType, ...params } = useSearch({ from: '/_authenticated/workflows/$workflowId/' });
  const navigate = useNavigate();
  const { setNodes } = useReactFlow<CanvasNode>();
  const setNodeCredential = useSetNodeCredential();
  const handleResult = useOAuth2ResultHandler();

  const onReturn = useEffectEvent(() => {
    if (!params.oauth) return;
    if (node) setNodes((nodes) => nodes.map((canvasNode) => ({ ...canvasNode, selected: canvasNode.id === node })));
    void handleResult(toOAuth2Result(params), (credentialId) => node && credentialType && setNodeCredential(node, credentialType, credentialId));
    void navigate({ to: '/workflows/$workflowId', params: { workflowId }, search: {}, replace: true });
  });

  useEffect(() => onReturn(), []);
};
