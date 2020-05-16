import styled from 'astroturf';
import React from 'react';

const Wrapper = styled('div')<{ size?: 'small' | 'medium' | 'large', active?: boolean }>`
  position: relative;

  &::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(black, 0.5);
  }

  &.active::after {
    display: none;
  }

  $base-width: 128px;
  $base-radius: 8px;
  $sizes: ('small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    @if $name == 'small' {
      width: $base-width * $scale;
      height: $base-width * $scale;
      &::after {
        border-radius: $base-radius * $scale;
      }
    } @else {
      &.size-#{$name} {
        width: $base-width * $scale;
        height: $base-width * $scale;
        &::after {
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
  onClick?(): void;
}

export default function UnitIcon(props: Props) {
  const { unitId, name, rarity, size, active, onClick } = props;
  const rarityFactor = [, 1, 1, 3, 3, 3, 6][rarity] ?? 1;
  const iconId = String(Number(unitId) + rarityFactor * 10).padStart(6, '0');
  const src = new URL(`/icons/unit/${iconId}.png`, 'https://ames-static.tirr.dev');
  return (
    <Wrapper size={size} active={active} onClick={onClick}>
      <Icon alt={name} src={src.toString()} />
    </Wrapper>
  );
}
