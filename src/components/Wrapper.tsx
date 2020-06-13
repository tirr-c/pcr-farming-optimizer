import React from 'react';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';

import { useStateContext } from '../state';

const LOCAL_STORAGE_KEY = 'farming-optimizer-snapshot';

interface Props {
  region: string;
  children?: React.ReactNode;
}

export default function Wrapper(props: Props) {
  const { children, region } = props;
  const rootState = useStateContext();
  React.useEffect(() => {
    const storageKey = `${LOCAL_STORAGE_KEY}.${region}`;
    try {
      let savedSnapshotRaw = window.localStorage.getItem(storageKey);
      if (savedSnapshotRaw == null && region === 'jp') {
        savedSnapshotRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      if (savedSnapshotRaw != null) {
        const savedSnapshot = JSON.parse(savedSnapshotRaw);
        applySnapshot(rootState, savedSnapshot);
        window.localStorage.setItem(storageKey, savedSnapshotRaw);
      }
    } catch (e) {
      // drop
    }

    const dispose = onSnapshot(rootState, snapshot => {
      const json = JSON.stringify(snapshot);
      try {
        window.localStorage.setItem(storageKey, json);
      } catch (e) {
        // drop
      }
    });

    return dispose;
  }, [rootState, region]);

  return <>{children}</>;
}
