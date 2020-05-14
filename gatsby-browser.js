// gatsby-browser.js
const ReactDOM = require('react-dom');

exports.replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.unstable_createRoot(container, {
      hydrate: process.env.NODE_ENV === 'production',
      hydrationOptions: { onHydrated: callback },
    }).render(element);
  };
};
