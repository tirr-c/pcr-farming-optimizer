import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import React from 'react';

import { getEquipsForRank } from '../resources/units';
import Unit from '../state/unit';

import EquipIcon from './EquipIcon';
import UnitIcon from './UnitIcon';
import { useResource } from './Wrapper';

const Wrapper = styled('li')`
  display: grid;
  width: 96px * 2 + 8px;
  grid-template-columns: repeat(2, 96px);
  grid-gap: 8px;
  gap: 8px;
`;

const UnitName = styled('h3')`
  font-size: 16px;
  font-weight: bold;
  align-self: self-end;
`;

const EquipGrid = styled('ul')`
  display: grid;
  grid-template-columns: repeat(2, 48px);
  grid-template-rows: auto 28px;
  grid-auto-rows: 48px;
  grid-gap: 0;
  gap: 0;
`;

const EquipGridLabel = styled('div')`
  font-size: 14px;
`;

const RankSelectorWrapper = styled('label')`
  grid-area: auto / span 2;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 4px;
  border: 1px solid black;
  border-radius: 4px;

  &:focus-within {
    outline: 1px dotted #212121;
    outline: auto -webkit-focus-ring-color;
  }

  &::after {
    flex: none;
    display: block;
    content: '▼';
    position: relative;
    top: 1px;
    margin-left: 4px;
    font-size: 0.9em;
  }
`;

const RankSelector = styled('select')`
  flex: 1;
  display: block;
  appearance: none;
  border: 0;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 0.9em;
  -webkit-tap-highlight-color: rgba(black, 0);

  &:focus, &:active {
    outline: none;
  }
`;

interface Props {
  unit: Instance<typeof Unit>;
}

export default function UnitEquips(props: Props) {
  const { unit } = props;
  const id = useObserver(() => unit.id);
  const unitData = useResource('unit').get();
  const unitDetail = unitData.get(id);
  const name = unitDetail?.name ?? '';
  const availableRanks = unitDetail?.equips.length ?? 1;
  const [rankFrom, equipDataFrom] = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankFrom, unitData) || [];
    const data = equipIds.map((id, idx) => ({
      id,
      active: unit.equipFrom[idx],
    }));
    return [unit.rankFrom, data];
  });
  const [rankTo, equipDataTo] = useObserver(() => {
    const equipIds = getEquipsForRank(unit.id, unit.rankTo, unitData) || [];
    const data = equipIds.map((id, idx) => ({
      id,
      active: unit.equipTo[idx],
    }));
    return [unit.rankTo, data];
  });
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
      <UnitIcon unitId={id} name={name} rarity={1} active size="large" />
      <UnitName>{name}</UnitName>
      <EquipGrid>
        <EquipGridLabel>From:</EquipGridLabel>
        <RankSelectorWrapper>
          <RankSelector value={String(rankFrom)} onChange={handleRankFromChange}>
            {rankOptions}
          </RankSelector>
        </RankSelectorWrapper>
        {equipDataFrom.map(({id, active}, idx) => (
          <EquipIcon
            key={idx}
            id={id}
            name=""
            active={active}
            size="small"
            onChange={value => unit.changeEquipFrom(idx, value)}
          />
        ))}
      </EquipGrid>
      <EquipGrid>
        <EquipGridLabel>To:</EquipGridLabel>
        <RankSelectorWrapper>
          <RankSelector value={String(rankTo)} onChange={handleRankToChange}>
            {rankOptions}
          </RankSelector>
        </RankSelectorWrapper>
        {equipDataTo.map(({id, active}, idx) => (
          <EquipIcon
            key={idx}
            id={id}
            name=""
            active={active}
            size="small"
            onChange={value => unit.changeEquipTo(idx, value)}
          />
        ))}
      </EquipGrid>
    </Wrapper>
  );
}
