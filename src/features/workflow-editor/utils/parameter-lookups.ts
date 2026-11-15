import { isJsonObject } from './json-object';
import { JsonObject, JsonValue } from '../types/workflow-editor.types';

// Mirrors the backend's parameter-template.ts, so previews resolve lookups exactly as a run does.
const PLACEHOLDER = /\{\{([^{}]*)\}\}/g;
const SOLE_PLACEHOLDER = /^\{\{([^{}]*)\}\}$/;
const LOOKUP_PATH = String.raw`((?:\.[A-Za-z_$][\w$]*|\[\d+\])*)$`;
const NODE_LOOKUP = new RegExp(String.raw`^\$\('([^'{}]+)'\)\.json` + LOOKUP_PATH);
const INPUT_LOOKUP = new RegExp(String.raw`^\$json` + LOOKUP_PATH);
const PATH_SEGMENT = /\.([A-Za-z_$][\w$]*)|\[(\d+)\]/g;

export interface LookupScope {
  input: JsonObject | undefined;
  nodeOutput: (nodeName: string) => JsonObject | undefined;
}

type Lookup = { kind: 'node'; nodeName: string; path: string } | { kind: 'input'; path: string };

const isTemplate = (value: string): boolean => value.startsWith('=');

const parseLookup = (expression: string): Lookup => {
  const trimmed = expression.trim();
  const input = INPUT_LOOKUP.exec(trimmed);
  if (input) return { kind: 'input', path: input[1] };
  const node = NODE_LOOKUP.exec(trimmed);
  if (!node) throw new Error(`only {{ $('Node').json.field }} and {{ $json.field }} lookups are supported, got "{{${expression}}}"`);
  return { kind: 'node', nodeName: node[1], path: node[2] };
};

const lookup = (expression: string, scope: LookupScope): JsonValue | undefined => {
  const parsed = parseLookup(expression);
  const output = parsed.kind === 'input' ? scope.input : scope.nodeOutput(parsed.nodeName);
  if (!output)
    throw new Error(
      parsed.kind === 'input'
        ? '$json has no input: this node has no parent that ran'
        : `node "${parsed.nodeName}" has not run yet in this execution`,
    );

  let value: JsonValue | undefined = output;
  for (const [, key, index] of parsed.path.matchAll(PATH_SEGMENT))
    value =
      key !== undefined
        ? isJsonObject(value) && Object.hasOwn(value, key)
          ? value[key]
          : undefined
        : Array.isArray(value)
          ? value.at(Number(index))
          : undefined;
  return value;
};

const toParameterString = (value: JsonValue): string => {
  if (value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
};

const resolveTemplate = (template: string, scope: LookupScope): JsonValue => {
  const body = template.slice(1);
  const sole = SOLE_PLACEHOLDER.exec(body.trim());
  if (sole) return lookup(sole[1], scope) ?? null;
  return body.replace(PLACEHOLDER, (_, expression: string) => toParameterString(lookup(expression, scope) ?? null));
};

const mapTemplateStrings = (value: JsonValue, map: (template: string, path: string) => JsonValue, path = ''): JsonValue => {
  if (typeof value === 'string') return isTemplate(value) ? map(value, path) : value;
  if (Array.isArray(value)) return value.map((element, index) => mapTemplateStrings(element, map, `${path}[${index}]`));
  if (isJsonObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, field]) => [key, mapTemplateStrings(field, map, path === '' ? key : `${path}.${key}`)]),
    );
  return value;
};

// Throws the run's error, prefixed with the leaf path inside a json parameter.
export const resolveParameterValue = (value: JsonValue, scope: LookupScope): JsonValue =>
  mapTemplateStrings(value, (template, path) => {
    try {
      return resolveTemplate(template, scope);
    } catch (error) {
      if (path === '' || !(error instanceof Error)) throw error;
      throw new Error(`${path}: ${error.message}`);
    }
  });

// Unsupported lookups are skipped here; resolving them reports the error.
export const findLookupNodeNames = (value: JsonValue): string[] => {
  const names = new Set<string>();
  mapTemplateStrings(value, (template) => {
    for (const [, expression] of template.slice(1).matchAll(PLACEHOLDER)) {
      const nodeName = NODE_LOOKUP.exec(expression.trim())?.[1];
      if (nodeName !== undefined) names.add(nodeName);
    }
    return template;
  });
  return [...names];
};
