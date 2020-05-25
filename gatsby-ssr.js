import React from 'react';

import Wrapper from './src/components/Wrapper';
import { Root } from './src/state';

export function wrapRootElement({ element }) {
  const rootState = Root.create({});
  return React.createElement(
    Wrapper,
    { rootState },
    element,
  );
}
