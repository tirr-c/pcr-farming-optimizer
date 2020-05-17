import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import React from 'react';

import units, { getEquipsForRank } from '../resources/units';
import { Unit } from '../state';

import EquipIcon from './EquipIcon';
import UnitIcon from './UnitIcon';

const Wrapper = styled('li')`
  display: flex;
  > * + * {
    margin-left: 8px;
  }
`;

const EquipGrid = styled('ul')`
  display: grid;
  grid-template-columns: repeat(2, 48px);
  grid-auto-rows: 48px;
  grid-gap: 0;
  gap: 0;
`;

const RequiredEquips = styled('div')`
  flex: 1;

  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  unit: Instance<typeof Unit>;
}

export default function UnitEquips(props: Props) {
  const { unit } = props;
  const id = useObserver(() => unit.id);
  const unitData = units.get();
  const name = unitData.get(id)?.name ?? '';
  const equipDataFrom = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankFrom) || [];
    return equipIds.map((id, idx) => ({
      id,
      active: unit.equipFrom[idx],
    }));
  });
  const equipDataTo = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankTo) || [];
    return equipIds.map((id, idx) => ({
      id,
      active: unit.equipTo[idx],
    }));
  });
  const requiredEquips = useObserver(() => unit.requiredEquipsWithResource(unitData));
  return (
    <Wrapper>
      <UnitIcon unitId={id} name={name} rarity={1} active size="medium" />
      <EquipGrid>
        {equipDataFrom.map(({id, active}, idx) => (
          <EquipIcon
            key={idx}
            id={id}
            name=""
            active={active}
            size="xsmall"
            onChange={value => unit.changeEquipFrom(idx, value)}
          />
        ))}
      </EquipGrid>
      <EquipGrid>
        {equipDataTo.map(({id, active}, idx) => (
          <EquipIcon
            key={idx}
            id={id}
            name=""
            active={active}
            size="xsmall"
            onChange={value => unit.changeEquipTo(idx, value)}
          />
        ))}
      </EquipGrid>
      <RequiredEquips>
        {requiredEquips.map((id, idx) => (
          <EquipIcon
            key={`${idx}-${id}`}
            id={id}
            name=""
            active
            size="xsmall"
          />
        ))}
      </RequiredEquips>
    </Wrapper>
  );
}
