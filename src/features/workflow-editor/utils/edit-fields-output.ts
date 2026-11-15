import { isJsonObject } from './json-object';
import { LookupScope, resolveParameterValue } from './parameter-lookups';
import { JsonObject, NodeParameters } from '../types/workflow-editor.types';

// Mirrors the backend's Edit Fields node, which outputs only the resolved Fields.
export const toEditFieldsOutput = ({ output }: NodeParameters, scope: LookupScope): JsonObject => {
  const fields = resolveParameterValue(output, scope);
  if (!isJsonObject(fields)) throw new Error('Edit Fields output is not an object');
  return fields;
};
