import { FC } from 'react';
import { useParams } from '@tanstack/react-router';

import { NodeTypeIcon } from './node-type-icon';
import { useSetNodeCredential } from '../hooks/use-set-node-credential';
import { CanvasNode } from '../types/workflow-editor.types';
import { buildNodeReturnTo } from '../utils/build-node-return-to';

import { CredentialPicker, findCredentialType, useCredentialTypes } from '@/features/workflow-credentials/public';

interface NodeCredentialFieldProps {
  node: CanvasNode;
  credentialTypeName: string;
}

export const NodeCredentialField: FC<NodeCredentialFieldProps> = ({ node, credentialTypeName }) => {
  const credentialType = findCredentialType(useCredentialTypes(), credentialTypeName);
  const { workflowId } = useParams({ from: '/_authenticated/workflows/$workflowId' });
  const setNodeCredential = useSetNodeCredential();

  return (
    <CredentialPicker
      credentialType={credentialType}
      icon={<NodeTypeIcon icon={credentialType.icon} className='size-4' />}
      value={node.data.credentials[credentialTypeName]?.id}
      onChange={(credentialId) => setNodeCredential(node.id, credentialTypeName, credentialId)}
      fallbackReturnTo={buildNodeReturnTo(workflowId, node.id, credentialTypeName)}
    />
  );
};
