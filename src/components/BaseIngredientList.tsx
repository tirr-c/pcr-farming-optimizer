import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { useStateContext } from '../state';
import units from '../resources/units';
import equipments, { computeBaseIngredients } from '../resources/equipments';
import EquipIcon from './EquipIcon';

const EquipGrid = styled('ul')`
  display: grid;
  max-width: 48px * 10;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, 48px);
  grid-auto-rows: 48px;
  grid-gap: 0;
  gap: 0;
`;

export default function BaseIngredientList() {
  const unitData = units.get();
  const rootState = useStateContext();
  const requiredEquips = useObserver(() => (
    [...rootState.units.values()]
      .flatMap(unit => unit.requiredEquipsWithResource(unitData))
  ));
  if (requiredEquips.length === 0) {
    return <div>No items to collect</div>;
  }
  const equipmentData = equipments.get();
  const baseIngredients = computeBaseIngredients(requiredEquips);
  const icons = [...baseIngredients.entries()]
    .sort(([idA], [idB]) => {
      const eqA = equipmentData.get(idA);
      const eqB = equipmentData.get(idB);
      if (eqA === eqB) {
        return 0;
      }
      if (eqA == null) {
        return 1;
      }
      if (eqB == null) {
        return -1;
      }
      if (eqA.promotion_level === eqB.promotion_level) {
        return idA < idB ? -1 : idA === idB ? 0 : 1;
      }
      const promoMap = {
        blue: 1,
        bronze: 2,
        silver: 3,
        gold: 4,
        purple: 5,
        special: 99,
      };
      const promoIdxA = promoMap[eqA.promotion_level];
      const promoIdxB = promoMap[eqB.promotion_level];
      return promoIdxA - promoIdxB;
    })
    .map(([id]) => (
      <li key={id}>
        <EquipIcon
          id={id}
          name={equipmentData.get(id)?.name || ''}
          size="xsmall"
          active
        />
      </li>
    ));

  return (
    <EquipGrid>
      {icons}
    </EquipGrid>
  );
}
