import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { useStateContext } from '../state';

import UnitEquips from './UnitEquips';

const Wrapper = styled('ul')`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: center;
  grid-gap: 16px;
  gap: 16px;
`;

export default function UnitEquipList() {
  const rootState = useStateContext();
  const units = useObserver(() => (
    [...rootState.units.values()]
      .map(unit => ({
        id: unit.id,
        unit,
      }))
  ));
  return (
    <Wrapper>
      {units.map(({ id, unit }) => <UnitEquips key={id} unit={unit} />)}
    </Wrapper>
  );
}