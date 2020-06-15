// gatsby-browser.js
import React from 'react';
import ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';

import './src/reset.css';
import { StateProvider, Root } from './src/state';

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
