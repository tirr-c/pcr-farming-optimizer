import styled from 'astroturf';
import React from 'react';

const Wrapper = styled('label')<{ size: 'xsmall' | 'small' | 'medium' | 'large' }>`
  display: block;
  position: relative;

  > input {
    appearance: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  $base-width: 128px;
  $base-radius: 8px;
  $sizes: ('xsmall': 0.375, 'small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} {
      width: $base-width * $scale;
      height: $base-width * $scale;
    }
  }
`;

const Icon = styled('img')`
  width: 100%;
  height: 100%;
`;

interface Props {
  id: string;
  name: string;
  size: 'xsmall' | 'small' | 'medium' | 'large';
  active?: boolean;
  onChange?(active: boolean): void;
}

export default function EquipIcon(props: Props) {
  const { id, name, size, active, onChange } = props;
  const src = new URL(`/icons/equipment/${active ? '' : 'invalid/'}${id}.png`, 'https://ames-static.tirr.dev');

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  }, [onChange]);
  return (
    <Wrapper size={size}>
      <Icon alt={name} src={src.toString()} />
      <input type="checkbox" checked={active} onChange={handleChange} />
    </Wrapper>
  );
}
