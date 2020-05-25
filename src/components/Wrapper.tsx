import React from 'react';
import { Instance, applySnapshot, onSnapshot } from 'mobx-state-tree';

import { StateProvider, Root } from '../state';

const LOCAL_STORAGE_KEY = 'farming-optimizer-snapshot';

interface Props {
  children?: React.ReactNode;
  rootState: Instance<typeof Root>;
}

export default function Wrapper(props: Props) {
  const { children, rootState } = props;
  React.useEffect(() => {
    try {
      const savedSnapshotRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSnapshotRaw != null) {
        const savedSnapshot = JSON.parse(savedSnapshotRaw);
        applySnapshot(rootState, savedSnapshot);
      }
    } catch (e) {
      // drop
    }

    const dispose = onSnapshot(rootState, snapshot => {
      const json = JSON.stringify(snapshot);
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, json);
      } catch (e) {
        // drop
      }
    });

    return dispose;
  }, [rootState]);

  return (
    <StateProvider value={rootState}>
      {children}
    </StateProvider>
  );
}
