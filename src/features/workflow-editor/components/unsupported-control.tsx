import { FC, use } from 'react';
import { ControlProps } from '@jsonforms/core';

import { ParameterField } from './parameter-field';
import { NodePropertiesContext } from '../contexts/node-properties.context';

// For property types newer than this editor: the value is kept exactly as loaded and saved back unchanged.
export const UnsupportedControl: FC<ControlProps> = ({ id, path, label, description, data, visible }) => {
  const property = use(NodePropertiesContext).find(({ name }) => name === path);
  if (!property) throw new Error(`No node property for ${path}`);

  return (
    <ParameterField id={id} path={path} label={label} description={description} value={data} visible={visible}>
      <p id={id} className='text-muted-foreground/70 rounded-lg border border-dashed px-3 py-2 font-mono text-[10px] tracking-widest uppercase'>
        {`${String(property.type)} fields can't be edited here yet · saved as loaded`}
      </p>
    </ParameterField>
  );
};
