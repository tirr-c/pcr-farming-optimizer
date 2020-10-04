import styled from 'astroturf';
import React from 'react';

import Icon from './Icon';
import Picture from './Picture';

const Wrapper = styled('label')<{ size: 'medium' | 'large' | 'xlarge' }>`
  width: 100%;
  height: 100%;
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

  $base-radius: 8px;
  $sizes: ('medium': 0.5, 'large': 0.75, 'xlarge': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} {
      > input {
        border-radius: $base-radius * $scale;
      }
    }
  }
`;

interface Props {
  unitId: string;
  name: string;
  rarity: number;
  size: 'medium' | 'large' | 'xlarge';
  active?: boolean;
  onChange?(active: boolean): void;
}

export default function UnitIcon(props: Props) {
  const { unitId, name, rarity, size, active, onChange } = props;
  const rarityFactor = [, 1, 1, 3, 3, 3, 6][rarity] ?? 1;
  const iconId = String(Number(unitId) + rarityFactor * 10).padStart(6, '0');
  const src = new URL(`/icons/unit/${iconId}.png`, 'https://pcrdb.tirr.dev');
  const srcWebp = new URL(`/icons/unit/${iconId}.webp`, 'https://pcrdb.tirr.dev');

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  }, [onChange]);
  return (
    <Wrapper size={size}>
      <Picture>
        <source srcSet={srcWebp.toString()} type="image/webp" />
        <Icon size={size} alt={name} src={src.toString()} />
      </Picture>
      <input type="checkbox" checked={active} onChange={handleChange} />
    </Wrapper>
  );
}
