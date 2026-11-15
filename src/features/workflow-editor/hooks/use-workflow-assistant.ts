import { use } from 'react';

import { WorkflowAssistantContext } from '../contexts/workflow-assistant.context';

export const useWorkflowAssistant = () => {
  const workflowAssistant = use(WorkflowAssistantContext);
  if (!workflowAssistant) throw new Error('useWorkflowAssistant must be used inside WorkflowAssistantProvider');
  return workflowAssistant;
};
