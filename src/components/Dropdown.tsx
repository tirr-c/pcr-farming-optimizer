import styled from 'astroturf';
import React from 'react';

const DropdownWrapper = styled('label')`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 4px;
  border: 1px solid black;
  border-radius: 4px;

  > * {
    flex: 1;
  }

  &:focus-within {
    outline: 1px dotted #212121;
    outline: auto -webkit-focus-ring-color;
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

const DropdownCore = styled('select')`
  flex: none;
  display: block;
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 0.9em;
  -webkit-tap-highlight-color: rgba(black, 0);

  &:focus, &:active {
    outline: none;
  }
`;

interface Props {
  value?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onChange?(value: string): void;
}

export default function Dropdown(props: Props) {
  const { value, label, children, className, onChange } = props;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  return (
    <DropdownWrapper className={className}>
      {label}
      <DropdownCore value={value} onChange={handleChange}>
        {children}
      </DropdownCore>
    </DropdownWrapper>
  );
}
