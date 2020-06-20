import styled from 'astroturf';

const Icon = styled('img')<{ size: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' }>`
  display: block;

  $base-width: 128px;
  $sizes: ('xxsmall': 0.25, 'xsmall': 0.3125, 'small': 0.375, 'medium': 0.5, 'large': 0.75, 'xlarge': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} {
      width: $base-width * $scale;
      height: $base-width * $scale;
    }
  }
`;

export default Icon;
