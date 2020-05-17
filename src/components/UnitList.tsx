import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import units from '../resources/units';
import { useStateContext } from '../state';

import UnitIcon from './UnitIcon';

const UnitListWrapper = styled('ul')`
  display: grid;
  max-width: 64px * 8 + 8px * 7;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-rows: 64px;
  grid-gap: 8px;
  gap: 8px;
`;

export default function UnitList() {
  const unitData = units.get();
  return (
    <UnitListWrapper>
      {[...unitData.values()].map(unit => {
        return (
          <UnitItem
            key={unit.id}
            id={unit.id}
            name={unit.name}
          />
        );
      })}
    </UnitListWrapper>
  );
}

function UnitItem(props: { id: string, name: string }) {
  const { id, name } = props;
  const rootState = useStateContext();
  const handleChange = React.useCallback(value => {
    if (value) {
      rootState.addUnit(id);
    } else {
      rootState.removeUnit(id);
    }
  }, [id, rootState]);
  return useObserver(() => (
    <UnitIcon
      unitId={id}
      name={name}
      rarity={1}
      active={rootState.units.has(id)}
      onChange={handleChange}
    />
  ));
}
