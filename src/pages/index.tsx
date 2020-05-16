import styled from 'astroturf';
import React from 'react';
import { withPrefix } from 'gatsby';

import UnitIcon from '../components/UnitIcon';
import RemoteResource from '../utils/RemoteResource';

const UnitListWrapper = styled('ul')`
  display: grid;
  max-width: #{64px * 8 + 8px * 7};
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-rows: 64px;
  grid-gap: 8px;
  gap: 8px;
`;

const units = new RemoteResource(async () => {
  const resp = await fetch(withPrefix('/data/unit.json'));
  return resp.json();
});

export default function Index() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <UnitList />
    </React.Suspense>
  );
}

function UnitList() {
  const unitData = units.get().$data;
  const unitDataFiltered = unitData.filter((unit: any) => {
    return (
      unit.id[0] === '1' &&
      unit.equips.every((equip: string[]) => equip.join('') !== '000000')
    );
  });
  const [checked, toggleId] = React.useReducer(
    (state: Record<string, boolean>, id: string) => {
      return {
        ...state,
        [id]: !state[id],
      };
    },
    unitDataFiltered,
    (data: any) => Object.fromEntries(data.map((unit: any) => [unit.id, false])),
  );
  return (
    <UnitListWrapper>
      {unitDataFiltered.map((unit: any) => {
        return (
          <UnitIcon
            key={unit.id}
            unitId={unit.id}
            name={unit.name}
            rarity={1}
            active={checked[unit.id]}
            onClick={() => toggleId(unit.id)}
          />
        );
      })}
    </UnitListWrapper>
  );
}
