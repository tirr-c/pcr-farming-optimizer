// gatsby-browser.js
import ReactDOM from 'react-dom';

import './src/reset.css';

export function replaceHydrateFunction() {
  return (element, container, callback) => {
    ReactDOM.unstable_createRoot(container, {
      hydrate: process.env.NODE_ENV === 'production',
      hydrationOptions: { onHydrated: callback },
    }).render(element);
  };
};
