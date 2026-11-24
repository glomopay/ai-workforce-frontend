import { WorkflowNodeGroup } from '../types/workflow-editor.types';
import {
  ExecutionFilters,
  ExecutionMode,
  ExecutionModeFilter,
  ExecutionStatus,
  ExecutionStatusFilter,
  ExecutionWindowFilter,
} from '../types/workflow-execution.types';

export const WORKFLOW_EDITOR_ENDPOINTS = {
  WORKFLOW: (workflowId: string) => `/workflows/${workflowId}`,
  ACTIVATE: (workflowId: string) => `/workflows/${workflowId}/activate`,
  DEACTIVATE: (workflowId: string) => `/workflows/${workflowId}/deactivate`,
  NODE_TYPES: '/workflow-node-types',
  EXECUTIONS: (workflowId: string) => `/workflows/${workflowId}/executions`,
  VERSIONS: (workflowId: string) => `/workflows/${workflowId}/versions`,
  VERSION: (workflowId: string, versionId: string) => `/workflows/${workflowId}/versions/${versionId}`,
  EXECUTION: (executionId: string) => `/workflow-executions/${executionId}`,
  NODE_RUNS: (executionId: string, nodeId: string) => `/workflow-executions/${executionId}/node-runs/${nodeId}`,
  ASSISTANT_MESSAGES: (workflowId: string) => `/workflows/${workflowId}/assistant/messages`,
};

export const WORKFLOW_EDITOR_QUERY_KEYS = {
  WORKFLOW: (workflowId: string) => ['workflows', 'detail', workflowId],
  NODE_TYPES: ['workflow-node-types'],
  VERSION: (workflowId: string, versionId: string) => ['workflows', 'versions', workflowId, versionId],
  EXECUTIONS_OF: (workflowId: string) => ['workflow-executions', 'list', workflowId],
  EXECUTIONS: (workflowId: string, filters: ExecutionFilters) => ['workflow-executions', 'list', workflowId, filters],
  EXECUTION: (executionId: string) => ['workflow-executions', executionId],
  ASSISTANT_MESSAGES: (workflowId: string) => ['workflows', 'assistant-messages', workflowId],
  NODE_RUNS: (executionId: string, nodeId: string, finishedRuns: number, isWaiting: boolean) => [
    'workflow-executions',
    executionId,
    'node-runs',
    nodeId,
    finishedRuns,
    isWaiting,
  ],
};

export const NODE_GROUP_LABELS: Record<WorkflowNodeGroup, string> = {
  trigger: 'Triggers',
  controlFlow: 'Control flow',
  transform: 'Transform',
  action: 'Actions',
};

export const NODE_TYPE_DRAG_FORMAT = 'application/x-workflow-node-type';

export const OPERATION_PROPERTY_NAME = 'operation';

export const FIT_VIEW_OPTIONS = { maxZoom: 1 };

export const SAVED_TOAST_DURATION = 4500;

export const RUN_BAR_AUTO_HIDE_DELAY = 5000;

export const EXECUTION_POLL_INTERVAL = 1000;

export const WAITING_EXECUTION_POLL_INTERVAL = 10000;

export const EXECUTIONS_PAGE_SIZE = 20;

// The run history polls for new runs and status changes; React Query pauses it while the tab is hidden.
export const EXECUTIONS_POLL_INTERVAL = 5000;

export const LIVE_CLOCK_INTERVAL = 100;

export const FINISHED_EXECUTION_STATUSES: ExecutionStatus[] = ['SUCCEEDED', 'FAILED', 'CRASHED'];

// Node type descriptions don't say which types iterate (the backend checks for an `iterate` method),
// so loops are known by type. Their body is everything reachable from this output.
export const ITERATING_NODE_TYPES = ['loop'];

export const LOOP_BODY_OUTPUT = '0';

// Runs from the editor start at the Manual Trigger; event triggers only start published versions.
export const MANUAL_TRIGGER_TYPE = 'manualTrigger';

// The editor previews this node's output from the current run.
export const EDIT_FIELDS_TYPE = 'editFields';

// Matches the backend's save DTO: z.string().trim().min(1).max(128).
export const NODE_NAME_MAX_LENGTH = 128;

// Run output trees open their top-level lists and objects; deeper ones start collapsed behind a one-line preview.
export const JSON_EXPANDED_DEPTH = 1;

export const JSON_PREVIEW_ENTRIES = 4;

export const JSON_PREVIEW_VALUE_MAX_CHARS = 32;

// Name-like keys lead a collapsed object's preview, so a GitHub file reads as its filename rather than its sha.
export const JSON_NAME_KEY_PATTERN = /name$/i;

export const JSON_TEXT_MAX_LINES = 6;

export const JSON_TEXT_MAX_CHARS = 400;

export const DEFAULT_EXECUTION_FILTERS: ExecutionFilters = { status: 'all', mode: 'all', window: 'all' };

export const EXECUTION_STATUS_FILTERS: Record<ExecutionStatusFilter, { label: string; statuses: ExecutionStatus[] }> = {
  all: { label: 'All', statuses: [] },
  succeeded: { label: 'Succeeded', statuses: ['SUCCEEDED'] },
  failed: { label: 'Failed', statuses: ['FAILED', 'CRASHED'] },
  running: { label: 'Running', statuses: ['QUEUED', 'RUNNING'] },
  waiting: { label: 'Paused', statuses: ['WAITING'] },
};

export const EXECUTION_MODE_FILTERS: Record<ExecutionModeFilter, { label: string; modes: ExecutionMode[] }> = {
  all: { label: 'All', modes: [] },
  manual: { label: 'Manual', modes: ['MANUAL'] },
  event: { label: 'Event', modes: ['APPLICATION_EVENT'] },
  schedule: { label: 'Schedule', modes: ['SCHEDULE'] },
};

export const EXECUTION_WINDOW_FILTERS: Record<ExecutionWindowFilter, { label: string; ms: number | null }> = {
  all: { label: 'All time', ms: null },
  '24h': { label: '24h', ms: 24 * 60 * 60 * 1000 },
  '7d': { label: '7d', ms: 7 * 24 * 60 * 60 * 1000 },
  '30d': { label: '30d', ms: 30 * 24 * 60 * 60 * 1000 },
};

export const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
  QUEUED: 'Queued',
  RUNNING: 'Running',
  WAITING: 'Paused',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
  CRASHED: 'Crashed',
};

export const EXECUTION_MODE_LABELS: Record<ExecutionMode, string> = {
  MANUAL: 'Manual',
  APPLICATION_EVENT: 'Event',
  SCHEDULE: 'Schedule',
};

// Matches the backend's message DTO cap.
export const ASSISTANT_MESSAGE_MAX_LENGTH = 5000;

// The counter shows once a message gets this close to the cap.
export const ASSISTANT_MESSAGE_COUNTER_FROM = 4000;

export const ASSISTANT_RENDER_THROTTLE = 40;

// Matches the backend's draft column width (WORKFLOW_DRAFT_LAYOUT.COLUMN_WIDTH), so pushed nodes land on its grid.
export const ASSISTANT_LAYOUT_COLUMN_WIDTH = 200;

export const VERSION_THUMBNAIL_SIZE = { width: 112, height: 64, padding: 10 };

// Canvas nodes are 96px squares positioned by their top-left corner.
export const CANVAS_NODE_SIZE = 96;

export const ASSISTANT_STARTER_PROMPTS = {
  build: [
    'When a Zoho Desk ticket is created, get the ticket and post its subject to Slack',
    'Every weekday at 9:00, ask LibreChat for a summary and post it to Slack',
    'When a GitHub issue is opened, hand it to the Coding Agent',
  ],
  refine: ['Explain what this workflow does, step by step', 'Only continue when the subject contains "refund"', 'What do I still need to fill in?'],
};

// How close to the bottom, in pixels, the assistant thread still counts as following new output.
export const STICK_TO_BOTTOM_THRESHOLD = 48;
