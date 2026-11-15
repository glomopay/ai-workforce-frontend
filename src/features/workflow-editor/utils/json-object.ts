import { JsonObject, JsonValue } from '../types/workflow-editor.types';

export const isJsonObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);

// Empty text stands for {}, which is also what the backend reads when the parameter is left out.
export const parseJsonObject = (text: string): JsonObject => {
  if (!text.trim()) return {};
  const value: JsonValue = JSON.parse(text);
  if (!isJsonObject(value)) throw new Error('The top level must be an object, like { "key": "value" }');
  return value;
};

// An empty object shows as empty text so the property's placeholder can show.
export const toJsonText = (value: JsonObject): string => (Object.keys(value).length ? JSON.stringify(value, null, 2) : '');

// The backend stores graphs as JSONB, which reorders object keys, so saved and edited graphs compare with sorted keys.
export const toStableJson = (value: unknown): string =>
  JSON.stringify(value, (_, child: unknown) =>
    isJsonObject(child) ? Object.fromEntries(Object.entries(child).sort(([a], [b]) => a.localeCompare(b))) : child,
  );
