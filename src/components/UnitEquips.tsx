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
  align-items: flex-start;
  max-width: 600px;
  margin: 0 auto;
  > * + * {
    margin-left: 8px;
  }
`;

const EquipGrid = styled('ul')`
  display: grid;
  grid-template-columns: repeat(2, 48px);
  grid-template-rows: 28px;
  grid-auto-rows: 48px;
  grid-gap: 0;
  gap: 0;
`;

const RankSelector = styled('select')`
  grid-area: auto / span 2;
  height: 24px;
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
  const unitDetail = unitData.get(id);
  const name = unitDetail?.name ?? '';
  const availableRanks = unitDetail?.equips.length ?? 1;
  const [rankFrom, equipDataFrom] = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankFrom) || [];
    const data = equipIds.map((id, idx) => ({
      id,
      active: unit.equipFrom[idx],
    }));
    return [unit.rankFrom, data];
  });
  const [rankTo, equipDataTo] = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankTo) || [];
    const data = equipIds.map((id, idx) => ({
      id,
      active: unit.equipTo[idx],
    }));
    return [unit.rankTo, data];
  });
  const requiredEquips = useObserver(() => unit.requiredEquipsWithResource(unitData));
  const handleRankFromChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRank = Number(e.target.value);
    unit.setRankFrom(newRank);
  }, [unit]);
  const handleRankToChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRank = Number(e.target.value);
    unit.setRankTo(newRank);
  }, [unit]);
  const rankOptions = Array(availableRanks).fill(null).map((_, idx) => (
    <option key={idx} value={String(idx + 1)}>RANK{idx + 1}</option>
  ));

  return (
    <Wrapper>
      <UnitIcon unitId={id} name={name} rarity={1} active size="medium" />
      <EquipGrid>
        <RankSelector value={String(rankFrom)} onChange={handleRankFromChange}>
          {rankOptions}
        </RankSelector>
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
        <RankSelector value={String(rankTo)} onChange={handleRankToChange}>
          {rankOptions}
        </RankSelector>
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
