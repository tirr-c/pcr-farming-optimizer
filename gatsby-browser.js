// gatsby-browser.js
import React from 'react';
import ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';

import Wrapper from './src/components/Wrapper';
import { StateProvider, Root } from './src/state';

import './src/reset.css';

if (!Intl.DisplayNames) {
  require('@formatjs/intl-displaynames/polyfill');
  require('@formatjs/intl-displaynames/dist/locale-data/en');
  require('@formatjs/intl-displaynames/dist/locale-data/ko');
}

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
    StateProvider,
    { value: rootState },
    element,
  );
};

export function wrapPageElement({ element }) {
  return React.createElement(
    Wrapper,
    {},
    element,
  );
}
