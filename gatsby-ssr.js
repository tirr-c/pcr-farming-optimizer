import React from 'react';

import Wrapper from './src/components/Wrapper';
import { StateProvider, Root } from './src/state';

export function wrapRootElement({ element }) {
  const rootState = Root.create({});
  return React.createElement(
    StateProvider,
    { value: rootState },
    element,
  );
}

export function wrapPageElement({ element }) {
  return React.createElement(
    Wrapper,
    {},
    element,
  );
}
