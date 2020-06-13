import React from 'react';

import { StateProvider, Root } from './src/state';

export function wrapRootElement({ element }) {
  const rootState = Root.create({});
  return React.createElement(
    StateProvider,
    { value: rootState },
    element,
  );
}
