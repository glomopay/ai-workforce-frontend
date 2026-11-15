import {
  and,
  isControl,
  isObjectControl,
  isOneOfEnumControl,
  isStringControl,
  JsonFormsRendererRegistryEntry,
  optionIs,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps, withJsonFormsLayoutProps } from '@jsonforms/react';

import { JsonControl } from '../components/json-control';
import { SelectControl } from '../components/select-control';
import { TextControl } from '../components/text-control';
import { TextareaControl } from '../components/textarea-control';
import { UnsupportedControl } from '../components/unsupported-control';
import { VerticalLayoutRenderer } from '../components/vertical-layout-renderer';

// Ranks sit above the vanilla renderers (1) so these win if both sets are ever registered. Any other control is a
// property type this editor doesn't know yet, which falls through to the unsupported renderer.
export const PARAMETER_RENDERERS: JsonFormsRendererRegistryEntry[] = [
  { tester: rankWith(2, uiTypeIs('VerticalLayout')), renderer: withJsonFormsLayoutProps(VerticalLayoutRenderer) },
  { tester: rankWith(2, isStringControl), renderer: withJsonFormsControlProps(TextControl) },
  { tester: rankWith(3, and(isStringControl, optionIs('multi', true))), renderer: withJsonFormsControlProps(TextareaControl) },
  { tester: rankWith(3, isOneOfEnumControl), renderer: withJsonFormsControlProps(SelectControl) },
  { tester: rankWith(2, isObjectControl), renderer: withJsonFormsControlProps(JsonControl) },
  { tester: rankWith(1, isControl), renderer: withJsonFormsControlProps(UnsupportedControl) },
];
