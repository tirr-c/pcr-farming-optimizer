import { types, Instance } from 'mobx-state-tree';
import React from 'react';

import {
  Equipment as EquipmentResource,
  computeBaseIngredients,
} from '../resources/equipments';
import { Unit as UnitResource } from '../resources/units';

import Unit from './unit';

export const Equipment = types
  .model('Equipment', {
    id: types.identifier,
  });

export const Root = types
  .model('Root', {
    units: types.map(Unit),
    excludedEquips: types.map(Equipment),
    unitListOpen: true,
  })
  .views(self => ({
    allRequiredEquipsWithResource(units: Map<string, UnitResource>) {
      return [...self.units.values()]
        .flatMap(unit => unit.requiredEquipsWithResource(units));
    },
  }))
  .views(self => ({
    allBaseIngredientsWithResource(
      units: Map<string, UnitResource>,
      equipments: Map<string, EquipmentResource>,
    ) {
      const requiredEquips = self.allRequiredEquipsWithResource(units);
      return computeBaseIngredients(requiredEquips, equipments);
    },
  }))
  .views(self => ({
    allBaseIngredientsExcludedWithResource(
      units: Map<string, UnitResource>,
      equipments: Map<string, EquipmentResource>,
    ) {
      const ret = self.allBaseIngredientsWithResource(units, equipments);
      self.excludedEquips.forEach(({ id }) => {
        ret.delete(id);
      });
      return ret;
    },
  }))
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
    excludeEquip(id: string) {
      self.excludedEquips.put({ id });
    },
    includeEquip(id: string) {
      self.excludedEquips.delete(id);
    },
    setUnitListOpen(state: boolean) {
      self.unitListOpen = state;
    },
    toggleUnitListOpen() {
      self.unitListOpen = !self.unitListOpen;
    },
    clear() {
      self.units.clear();
      self.excludedEquips.clear();
    },
  }));

export type RootType = Instance<typeof Root>;

const defaultState = Root.create({});
const Context = React.createContext<RootType>(defaultState);
export const StateProvider = Context.Provider;

export function useStateContext(): RootType {
  return React.useContext(Context);
}
