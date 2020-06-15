import React from 'react';
import { applySnapshot, onSnapshot } from 'mobx-state-tree';

import { Equipment, loadEquipments } from '../resources/equipments';
import { QuestMaps, loadQuests } from '../resources/quests';
import { Unit, loadUnits } from '../resources/units';
import { useStateContext } from '../state';
import RemoteResource from '../utils/RemoteResource';

const LOCAL_STORAGE_KEY = 'farming-optimizer-snapshot';

const ResourceContext = React.createContext<ResourceContextType | null>(null);

interface ResourceContextType {
  unit: RemoteResource<Map<string, Unit>>;
  equipment: RemoteResource<Map<string, Equipment>>;
  quest: RemoteResource<QuestMaps>;
  pending: boolean;
}

interface Props {
  region: string;
  children?: React.ReactNode;
}

export default function Wrapper(props: Props) {
  const { children, region } = props;
  const [resources, setResources] = React.useState(() => ({
    unit: loadUnits(region),
    equipment: loadEquipments(region),
    quest: loadQuests(region),
    region,
  }));
  const [startTransition, isPending] = (React as any).unstable_useTransition({ timeoutMs: 2000 });

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

  React.useEffect(() => {
    if (resources.region === region) {
      return;
    }
    startTransition(() => {
      setResources({
        unit: loadUnits(region),
        equipment: loadEquipments(region),
        quest: loadQuests(region),
        region,
      });
    });
  }, [region]);

  const contextValue = {
    unit: resources.unit,
    equipment: resources.equipment,
    quest: resources.quest,
    pending: isPending,
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
  if (ctx == null) {
    throw new Error();
  }
  return ctx[type];
}
