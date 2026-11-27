import { ClipboardEvent, FC } from 'react';
import { ControlProps } from '@jsonforms/core';

import { ParameterField } from './parameter-field';
import { extractPastedId } from '../utils/extract-pasted-id';

import { Input } from '@/shared/components/ui/input';

export const TextControl: FC<ControlProps> = ({ id, path, label, description, data, visible, uischema, handleChange }) => {
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedId = extractPastedId(path, event.clipboardData.getData('text'));
    if (pastedId === undefined) return;
    event.preventDefault();
    handleChange(path, pastedId);
  };

  return (
    <ParameterField id={id} path={path} label={label} description={description} value={data} visible={visible}>
      <Input
        id={id}
        value={data}
        placeholder={uischema.options?.placeholder}
        onPaste={onPaste}
        onChange={(event) => handleChange(path, event.target.value)}
      />
    </ParameterField>
  );
};
