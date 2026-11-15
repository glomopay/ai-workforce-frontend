import { FC, useState } from 'react';
import { ControlProps } from '@jsonforms/core';

import { ParameterField } from './parameter-field';
import { JsonObject } from '../types/workflow-editor.types';
import { parseJsonObject, toJsonText } from '../utils/json-object';

import { Textarea } from '@/shared/components/ui/textarea';

// The text is local so a half-typed edit never reaches the parameters, which keep the last valid object (drafts still
// save, as with required fields). A new object from outside, such as a reload, replaces the text.
export const JsonControl: FC<ControlProps> = ({ id, path, label, description, data, visible, uischema, handleChange }) => {
  const [text, setText] = useState(() => toJsonText(data));
  const [syncedData, setSyncedData] = useState<JsonObject>(data);
  const [error, setError] = useState<string | null>(null);
  if (data !== syncedData) {
    setSyncedData(data);
    setText(toJsonText(data));
    setError(null);
  }

  const onChange = (nextText: string) => {
    setText(nextText);
    try {
      const value = parseJsonObject(nextText);
      setSyncedData(value);
      setError(null);
      handleChange(path, value);
    } catch (parseError) {
      if (!(parseError instanceof Error)) throw parseError;
      setError(parseError.message);
    }
  };

  return (
    <ParameterField id={id} path={path} label={label} description={description} value={data} visible={visible}>
      <Textarea
        id={id}
        value={text}
        rows={8}
        spellCheck={false}
        aria-invalid={error !== null}
        placeholder={uischema.options?.placeholder}
        className='field-sizing-fixed resize-y font-mono text-xs md:text-xs'
        onChange={(event) => onChange(event.target.value)}
      />
      {error !== null && (
        <div className='animate-in fade-in flex flex-col gap-1 duration-200'>
          <p className='text-destructive font-mono text-[10px] tracking-widest uppercase'>Invalid JSON · last valid value saves</p>
          <p className='text-destructive text-xs leading-snug wrap-break-word'>{error}</p>
        </div>
      )}
    </ParameterField>
  );
};
