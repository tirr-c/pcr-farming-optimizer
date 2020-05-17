import { types, Instance } from 'mobx-state-tree';
import React from 'react';

export const Unit = types
  .model('Unit', {
    id: types.identifier,
    rankFrom: 1,
    equipFrom: types.optional(types.array(types.boolean), () => Array(6).fill(false)),
    rankTo: 1,
    equipTo: types.optional(types.array(types.boolean), () => Array(6).fill(false)),
  })
  .actions(self => {
    function setRankFrom(val: number) {
      self.rankFrom = val;
    }
    function changeEquipFrom(idx: number, val: boolean) {
      if (idx < 0 || idx >= 6) {
        return;
      }
      self.equipFrom[idx] = val;
    }
    function setRankTo(val: number) {
      self.rankTo = val;
    }
    function changeEquipTo(idx: number, val: boolean) {
      if (idx < 0 || idx >= 6) {
        return;
      }
      self.equipTo[idx] = val;
    }
    return {
      setRankFrom,
      changeEquipFrom,
      setRankTo,
      changeEquipTo,
    };
  });

export const Root = types
  .model('Root', {
    units: types.map(Unit),
  })
  .actions(self => ({
    addUnit(id: string) {
      if (self.units.has(id)) {
        return;
      }
      self.units.put({ id });
    },
    removeUnit(id: string) {
      self.units.delete(id);
    },
  }));

export type RootType = Instance<typeof Root>;

const Context = React.createContext<RootType | null>(null);
export const StateProvider = Context.Provider;

export function useStateContext(): RootType {
  const state = React.useContext(Context);
  if (state == null) {
    throw new Error('Root state not initialized');
  }
  return state;
}
