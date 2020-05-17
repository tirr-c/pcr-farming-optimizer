import styled from 'astroturf';
import React from 'react';

const Wrapper = styled('label')<{ size?: 'small' | 'medium' | 'large' }>`
  position: relative;

  > input {
    appearance: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(black, 0.5);

    &:checked {
      background-color: transparent;
    }
  }

  $base-width: 128px;
  $base-radius: 8px;
  $sizes: ('small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    @if $name == 'small' {
      width: $base-width * $scale;
      height: $base-width * $scale;
      > input {
        border-radius: $base-radius * $scale;
      }
    } @else {
      &.size-#{$name} {
        width: $base-width * $scale;
        height: $base-width * $scale;
        > input {
          border-radius: $base-radius * $scale;
        }
      }
    }
  }
`;

const Icon = styled('img')`
  width: 100%;
  height: 100%;
`;

interface Props {
  unitId: string;
  name: string;
  rarity: number;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  onChange?(active: boolean): void;
}

export default function UnitIcon(props: Props) {
  const { unitId, name, rarity, size, active, onChange } = props;
  const rarityFactor = [, 1, 1, 3, 3, 3, 6][rarity] ?? 1;
  const iconId = String(Number(unitId) + rarityFactor * 10).padStart(6, '0');
  const src = new URL(`/icons/unit/${iconId}.png`, 'https://ames-static.tirr.dev');

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
