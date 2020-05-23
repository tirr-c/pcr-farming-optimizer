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
  const equipmentData = equipments.get();
  const baseIngredients = computeBaseIngredients(requiredEquips);
  const icons = [...baseIngredients.entries()]
    .sort(([idA], [idB]) => idA < idB ? -1 : idA === idB ? 0 : 1)
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
