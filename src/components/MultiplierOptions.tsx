import React from 'react';

import Dropdown from './Dropdown';

interface Props {
  label?: string;
  multiplier: number;
  onChange?(multiplier: number): void;
}

export default function MultiplierOptions(props: Props) {
  const { label, multiplier, onChange } = props;
  const handleChange = React.useCallback((value: string) => {
    onChange?.(Number(value));
  }, [onChange]);
  return (
    <Dropdown
      label={<span>{label}</span>}
      value={String(multiplier)}
      onChange={handleChange}
    >
      <option value="1">x1</option>
      <option value="2">x2</option>
      <option value="3">x3</option>
    </Dropdown>
  );
}
