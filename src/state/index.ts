import { types, Instance } from 'mobx-state-tree';
import React from 'react';

import { Unit as UnitResource } from '../resources/units';

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
  })
  .views(self => ({
    get requiredEquips() {
      const ret = new Map<number, boolean[]>();
      if (self.rankFrom === self.rankTo) {
        const req = self.equipFrom.map((val, idx) => !val && self.equipTo[idx]);
        ret.set(self.rankFrom, req);
        return ret;
      }
      if (self.rankFrom > self.rankTo) {
        return ret;
      }
      ret.set(self.rankFrom, self.equipFrom.map(val => !val));
      for (let i = self.rankFrom + 1; i < self.rankTo; i += 1) {
        ret.set(i, Array(6).fill(true));
      }
      ret.set(self.rankTo, self.equipTo.toJS());
      return ret;
    },
  }))
  .views(self => ({
    requiredEquipsWithResource(units: Map<string, UnitResource>) {
      const required = self.requiredEquips;
      const unit = units.get(self.id);
      if (unit == null) {
        return [];
      }
      return [...required.entries()]
        .flatMap(([rank, required]) => {
          return unit.equips[rank - 1]
            ?.filter((_, idx) => required[idx]) ?? [];
        })
        .sort();
    }
  }));

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
