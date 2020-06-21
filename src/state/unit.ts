import { types } from 'mobx-state-tree';

import { Unit as UnitResource } from '../resources/units';

const Unit = types
  .model('Unit', {
    id: types.identifier,
    rankFrom: 1,
    equipFrom: types.optional(types.array(types.boolean), () => Array(6).fill(false)),
    rankTo: 1,
    equipTo: types.optional(types.array(types.boolean), () => Array(6).fill(true)),
  })
  .actions(self => {
    function setRankFrom(val: number) {
      self.rankFrom = val;
      for (let i = 0; i < 6; i += 1) {
        self.equipFrom[i] = (val > 1);
      }
    }
    function changeEquipFrom(idx: number, val: boolean) {
      if (idx < 0 || idx >= 6) {
        return;
      }
      self.equipFrom[idx] = val;
    }
    function setRankTo(val: number) {
      self.rankTo = val;
      for (let i = 0; i < 6; i += 1) {
        self.equipTo[i] = true;
      }
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
        .filter(id => id !== '999999');
    }
  }));

export default Unit;
