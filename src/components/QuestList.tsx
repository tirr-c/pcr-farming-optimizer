import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import equipments from '../resources/equipments';
import units from '../resources/units';
import { rankQuests } from '../resources/quests';
import { useStateContext } from '../state';

const Title = styled('h2')`
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

export default function QuestList() {
  const unitData = units.get();
  const equipmentData = equipments.get();
  const rootState = useStateContext();
  const equipmentIdMap = useObserver(
    () => rootState.allBaseIngredientsWithResource(unitData, equipmentData)
  );
  const quests = React.useMemo(() => rankQuests(equipmentIdMap), [equipmentIdMap]);
  return (
    <section>
      <Title>Recommended Quests</Title>
      <ul>
        {quests.map(({ id, score }) => (
          <li key={id}>{id} ({score})</li>
        ))}
      </ul>
    </section>
  );
}
