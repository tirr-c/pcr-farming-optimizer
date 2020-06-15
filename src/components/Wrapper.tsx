import React from 'react';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';

import { Equipment, loadEquipments } from '../resources/equipments';
import { QuestMaps, loadQuests } from '../resources/quests';
import { Unit, loadUnits } from '../resources/units';
import { useStateContext } from '../state';
import RemoteResource from '../utils/RemoteResource';

const LOCAL_STORAGE_KEY = 'farming-optimizer-snapshot';

const ResourceContext = React.createContext<ResourceContextType>({
  unit: RemoteResource.empty,
  equipment: RemoteResource.empty,
  quest: RemoteResource.empty,
  pending: false,
  load() {},
});

interface ResourceContextType {
  unit: RemoteResource<Map<string, Unit>>;
  equipment: RemoteResource<Map<string, Equipment>>;
  quest: RemoteResource<QuestMaps>;
  pending: boolean;
  load(region: string): void;
}

interface Props {
  children?: React.ReactNode;
}

export default function Wrapper(props: Props) {
  const { children } = props;
  const [resources, setResources] = React.useState<Pick<ResourceContextType, 'unit' | 'equipment' | 'quest'>>({
    unit: RemoteResource.empty,
    equipment: RemoteResource.empty,
    quest: RemoteResource.empty,
  });
  const [region, setRegion] = React.useState('');
  const [startTransition, isPending] = (React as any).unstable_useTransition({ timeoutMs: 1000 });

  const rootState = useStateContext();
  React.useEffect(() => {
    if (region === '') {
      return;
    }
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
      } else {
        rootState.clear();
      }
    } catch (e) {
      // drop
      rootState.clear();
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

  const load = React.useCallback((newRegion: string) => {
    if (region === newRegion) {
      return;
    }
    startTransition(() => {
      setResources({
        unit: loadUnits(newRegion),
        equipment: loadEquipments(newRegion),
        quest: loadQuests(newRegion),
      });
      setRegion(newRegion);
    });
  }, [region]);

  const contextValue = {
    ...resources,
    pending: isPending,
    load,
  };
  return (
    <ResourceContext.Provider value={contextValue}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResource<ResourceType extends keyof ResourceContextType>(
  type: ResourceType,
): ResourceContextType[ResourceType] {
  const ctx = React.useContext(ResourceContext);
  return ctx[type];
}
