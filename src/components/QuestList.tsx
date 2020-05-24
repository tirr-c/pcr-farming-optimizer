import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import equipments from '../resources/equipments';
import units from '../resources/units';
import { rankQuests } from '../resources/quests';
import { useStateContext } from '../state';

import Quest from './Quest';

const Title = styled('h2')`
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

const LoadMore = styled('button')`
  appearance: none;
  width: 100%;
  margin-top: 8px;
  height: 36px;
  font-size: 16px;
`;

export default function QuestList() {
  const [limit, setLimit] = React.useState(5);

  const unitData = units.get();
  const equipmentData = equipments.get();
  const rootState = useStateContext();
  const equipmentIdMap = useObserver(
    () => rootState.allBaseIngredientsWithResource(unitData, equipmentData)
  );
  const quests = React.useMemo(() => rankQuests(equipmentIdMap), [equipmentIdMap]);

  const handleLoadMore = React.useCallback(() => {
    setLimit(limit => limit + 5);
  }, []);

  return (
    <section>
      <Title>Recommended Quests</Title>
      <ul>
        {quests.slice(0, limit).map(({ id }) => (
          <Quest key={id} id={id} />
        ))}
      </ul>
      {quests.length > limit && (
        <LoadMore type="button" onClick={handleLoadMore}>
          Load more
        </LoadMore>
      )}
    </section>
  );
}
