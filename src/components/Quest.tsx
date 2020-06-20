import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { calculateDrops, Quest as QuestData } from '../resources/quests';
import { useStateContext } from '../state';

import EquipIcon from './EquipIcon';
import Icon from './Icon';
import { useResource } from './Wrapper';

const AreaId = styled('div')`
  display: flex;
  height: 32px;
  align-items: center;

  > img:last-of-type {
    margin-right: 8px;
  }
`;

const Drops = styled('dl')`
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;

  > * {
    margin-right: 4px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const DropGroup = styled('div')`
  flex: none;

  > dt {
  }

  > dd {
    display: flex;
  }
`;

interface Props {
  id: string;
  score?: number;
}

const difficulties = [, 'N', 'H', 'VH'];

interface MakeDropGroupsResult {
  memoryPieces: string[];
  groups: [number, string[]][][];
}

function makeDropGroups(quest: QuestData): MakeDropGroupsResult {
  function append(m: Map<number, string[]>, k: number, v: string) {
    const group = m.get(k) ?? [];
    group.push(v);
    m.set(k, group);
  }

  const questDrops = calculateDrops(quest);
  const memoryPieces = questDrops.flat()
    .map(drop => drop.reward.type === 'item' && drop.reward.id[0] === '3' ? drop.reward.id : null)
    .filter(drop => drop != null) as string[];
  const mainDropGroups = new Map<number, string[]>();
  const subDropGroups = new Map<number, string[]>();
  for (const drops of questDrops) {
    const equipments = drops
      .map(drop => drop.reward.type === 'equipment' ? [drop.odds, drop.reward.id] : null)
      .filter(drop => drop != null) as [number, string][];
    if (equipments.length === 0) {
      continue;
    }
    const targetMap = equipments.length > 1 ? subDropGroups : mainDropGroups;
    for (const [odds, id] of equipments) {
      append(targetMap, odds, id);
    }
  }
  const groupMaps = [];
  if (mainDropGroups.size > 0) {
    groupMaps.push(mainDropGroups);
  }
  if (subDropGroups.size > 0) {
    groupMaps.push(subDropGroups);
  }
  const groups = groupMaps.map(group => {
    const sorted = [...group.entries()];
    sorted.sort(([a], [b]) => b - a);
    return sorted;
  });
  return {
    memoryPieces,
    groups,
  };
}

export default function Quest(props: Props) {
  const { id } = props;
  const unitData = useResource('unit').get();
  const equipmentData = useResource('equipment').get();
  const { idQuestMap } = useResource('quest').get();
  const quest = idQuestMap.get(id);
  if (quest == null) {
    return null;
  }
  const difficultyId = difficulties[Number(id[1])];
  const areaId = parseInt(id.substring(2, 5), 10);
  const stageId = parseInt(id.substring(6, 9), 10);
  const { memoryPieces, groups } = makeDropGroups(quest);

  const rootState = useStateContext();
  const equipmentIdMap = useObserver(
    () => rootState.allBaseIngredientsExcludedWithResource(unitData, equipmentData)
  );

  return (
    <li>
      <AreaId>
        {memoryPieces.map(id => (
          <Icon
            key={id}
            size="xxsmall"
            src={new URL(`/icons/item/${id}.png`, 'https://ames-static.tirr.dev').toString()}
            alt=""
          />
        ))}
        {`${areaId}-${stageId}${difficultyId}`}
        {props.score != null && ` (scored ${props.score})`}
      </AreaId>
      <Drops>
        {groups.map((group, idx) => (
          <React.Fragment key={idx}>
            {group.map(([odds, ids]) => (
              <DropGroup key={odds}>
                <dt>{odds}%</dt>
                <dd>
                  {ids.map(id => (
                    <EquipIcon
                      key={id}
                      size={idx > 0 ? 'xsmall' : 'small'}
                      id={id}
                      name=""
                      dimInactive
                      active={equipmentIdMap.has(id)}
                    />
                  ))}
                </dd>
              </DropGroup>
            ))}
          </React.Fragment>
        ))}
      </Drops>
    </li>
  );
}
