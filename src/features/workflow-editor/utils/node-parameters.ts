import { isPropertyVisible } from './is-property-visible';
import { formatJson, isJsonObject } from './json-object';
import { JsonValue, NodeParameters, NodeProperty } from '../types/workflow-editor.types';

export const withDefaultParameters = (properties: NodeProperty[], parameters: NodeParameters): NodeParameters => ({
  ...Object.fromEntries(properties.map((property) => [property.name, property.default])),
  ...parameters,
});

// Matches the backend's required check: blank text, or an object with no keys.
export const isParameterEmpty = (value: JsonValue | undefined): boolean => {
  if (typeof value === 'string') return value.trim() === '';
  if (isJsonObject(value)) return Object.keys(value).length === 0;
  return value === undefined || value === null;
};

export const formatParameterValue = (value: JsonValue): string => (typeof value === 'string' ? value : formatJson(value));

const findRequiredProperties = (properties: NodeProperty[], parameters: NodeParameters): NodeProperty[] =>
  properties.filter((property) => property.required && isPropertyVisible(property, parameters));

export const findMissingProperties = (properties: NodeProperty[], parameters: NodeParameters): NodeProperty[] =>
  findRequiredProperties(properties, parameters).filter((property) => isParameterEmpty(parameters[property.name]));

// The backend rejects unknown keys, and hidden values must not survive a save.
export const toSavedParameters = (properties: NodeProperty[], parameters: NodeParameters): NodeParameters =>
  Object.fromEntries(
    properties
      .filter((property) => property.name in parameters && isPropertyVisible(property, parameters))
      .map((property) => [property.name, parameters[property.name]]),
  );
