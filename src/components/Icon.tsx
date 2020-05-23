import styled from 'astroturf';

const Icon = styled('img')<{ size: 'xsmall' | 'small' | 'medium' | 'large' }>`
  $base-width: 128px;
  $sizes: ('xsmall': 0.375, 'small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} {
      width: $base-width * $scale;
      height: $base-width * $scale;
    }
  }
`;

export default Icon;
