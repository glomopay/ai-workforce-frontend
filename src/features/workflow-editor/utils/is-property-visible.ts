import { NodeParameters, NodeProperty } from '../types/workflow-editor.types';

// Expects parameters merged over the property defaults (see withDefaultParameters). Like the backend, a json
// property never matches, since show values are strings.
export const isPropertyVisible = ({ displayOptions }: NodeProperty, parameters: NodeParameters): boolean =>
  !displayOptions || Object.entries(displayOptions.show).every(([name, values]) => values.some((value) => value === parameters[name]));
