import { createFileRoute } from '@tanstack/react-router';

import { WorkflowEditorPage } from '@/features/workflow-editor/public';
import { OAuth2ReturnParams, parseOAuth2ReturnParams } from '@/features/workflow-credentials/public';

// `node` and `credentialType` come back from a connect flow that left the page because its popup was blocked.
export const Route = createFileRoute('/_authenticated/workflows/$workflowId/')({
  validateSearch: (search): OAuth2ReturnParams & { node?: string; credentialType?: string } => ({
    node: typeof search.node === 'string' ? search.node : undefined,
    credentialType: typeof search.credentialType === 'string' ? search.credentialType : undefined,
    ...parseOAuth2ReturnParams(search),
  }),
  component: WorkflowEditorPage,
});
