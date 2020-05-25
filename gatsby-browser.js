// gatsby-browser.js
import React from 'react';
import ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';

import './src/reset.css';
import Wrapper from './src/components/Wrapper';
import { Root } from './src/state';

const rootState = Root.create({});

export function replaceHydrateFunction() {
  return (element, container, callback) => {
    ReactDOM.unstable_createRoot(container, {
      hydrate: process.env.NODE_ENV === 'production',
      hydrationOptions: { onHydrated: callback },
    }).render(element);
  };
};

export function wrapRootElement({ element }) {
  return React.createElement(
    Wrapper,
    { rootState },
    element,
  );
};
