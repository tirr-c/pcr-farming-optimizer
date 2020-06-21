import styled from 'astroturf';
import React from 'react';

const MultiplierLabel = styled('label')`
  display: flex;
  align-items: center;
  min-width: 120px;
  max-width: 150px;
  padding: 4px;
  border: 1px solid black;
  border-radius: 4px;

  &:focus-within {
    outline: 1px dotted #212121;
    outline: auto -webkit-focus-ring-color;
  }

  > span {
    flex: 1;
  }

  &::after {
    flex: none;
    display: block;
    box-sizing: border-box;
    content: '';
    width: 8px;
    height: 8px;
    margin: 0 4px 2px;
    border: solid black;
    border-width: 0 2px 2px 0;

    transform: rotate(45deg);
    transform-origin: 75% 75%;
  }
`;

const MultiplierSelect = styled('select')`
  flex: none;
  display: block;
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 100%;
  -webkit-tap-highlight-color: rgba(black, 0);

  &:focus, &:active {
    outline: none;
  }
`;

interface Props {
  label?: string;
  multiplier: number;
  onChange?(multiplier: number): void;
}

export default function MultiplierOptions(props: Props) {
  const { label, multiplier, onChange } = props;
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(Number(e.target.value));
  }, [onChange]);
  return (
    <MultiplierLabel>
      <span>{label}</span>
      <MultiplierSelect onChange={handleChange} value={multiplier}>
        <option value="1">x1</option>
        <option value="2">x2</option>
        <option value="3">x3</option>
      </MultiplierSelect>
    </MultiplierLabel>
  );
}
