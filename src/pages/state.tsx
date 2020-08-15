import { useIntl, Link } from 'gatsby-plugin-intl';
import { onSnapshot, getSnapshot } from 'mobx-state-tree';
import React from 'react';
import { Helmet } from 'react-helmet';

import { useStateContext } from '../state';

export default function StateManager() {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'state.title' });

  const rootState = useStateContext();
  const [downloadUrl, setDownloadUrl] = React.useState<string>();

  React.useEffect(() => {
    let url: string | undefined = downloadUrl;
    function handleSnapshot(snapshot: any) {
      if (url != null) {
        URL.revokeObjectURL(url);
      }
      const rawSnapshot = JSON.stringify(snapshot);
      const blob = new Blob([rawSnapshot], { type: 'application/octet-stream' });
      url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    }

    handleSnapshot(getSnapshot(rootState));
    return onSnapshot(rootState, handleSnapshot);
  }, [rootState]);

  return (
    <main>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Link to="/">{intl.formatMessage({ id: 'state.go-back' })}</Link>
      <h1>{title}</h1>
      <section>
        <h2>{intl.formatMessage({ id: 'state.save.title' })}</h2>
        <p>
          <a href={downloadUrl} download="state.json">
            {intl.formatMessage({ id: 'state.save.download' })}
          </a>
        </p>
      </section>
      <section>
        <h2>{intl.formatMessage({ id: 'state.load.title' })}</h2>
      </section>
    </main>
  );
}
