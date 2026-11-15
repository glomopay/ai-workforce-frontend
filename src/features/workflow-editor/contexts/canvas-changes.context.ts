import { createContext } from 'react';

import { CanvasChanges } from '../types/workflow-assistant.types';

// Null outside the editor, where run replays draw the same nodes and edges with nothing to mark.
export const CanvasChangesContext = createContext<CanvasChanges | null>(null);
