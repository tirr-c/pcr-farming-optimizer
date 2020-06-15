import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Multipliers, rankQuests } from '../resources/quests';
import { useStateContext } from '../state';

import Quest from './Quest';
import { useResource } from './Wrapper';

const Title = styled('h2')`
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

const List = styled('ul')`
  > * + * {
    margin-top: 12px;
  }
`;

const LoadMore = styled('button')`
  appearance: none;
  width: 100%;
  margin-top: 8px;
  height: 36px;
  font-size: 16px;
`;

export default function QuestList() {
  const intl = useIntl();
  const [limit, setLimit] = React.useState(5);
  const [multipliers, updateMultiplier] = React.useReducer(
    (multipliers: Multipliers, action: Multipliers) => ({ ...multipliers, ...action }),
    { normal: 1, hard: 1, veryHard: 1 },
    val => val,
  );

  const unitData = useResource('unit').get();
  const equipmentData = useResource('equipment').get();
  const questMaps = useResource('quest').get();
  const rootState = useStateContext();
  const equipmentIdMap = useObserver(
    () => rootState.allBaseIngredientsExcludedWithResource(unitData, equipmentData)
  );
  const quests = React.useMemo(
    () => rankQuests(equipmentIdMap, { questMaps, multipliers }),
    [equipmentIdMap, questMaps, multipliers],
  );

  const handleLoadMore = React.useCallback(() => {
    setLimit(limit => limit + 5);
  }, []);

  const handleNormalChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      updateMultiplier({ normal: value });
    },
    [],
  );
  const handleHardChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      updateMultiplier({ hard: value });
    },
    [],
  );
  const handleVeryHardChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      updateMultiplier({ veryHard: value });
    },
    [],
  );

  const multiplierOptions = (
    <>
      <option value="1">x1</option>
      <option value="2">x2</option>
      <option value="3">x3</option>
    </>
  );

  const multiplierMap: [string, React.ChangeEventHandler<HTMLSelectElement>][] = [
    [intl.formatMessage({ id: 'difficulty.nm' }), handleNormalChange],
    [intl.formatMessage({ id: 'difficulty.hd' }), handleHardChange],
    [intl.formatMessage({ id: 'difficulty.vh' }), handleVeryHardChange],
  ];
  return (
    <section>
      <Title>{intl.formatMessage({ id: 'recommended-quests.title' })}</Title>
      <div>
        {multiplierMap.map(([label, handler]) => (
          <label key={label}>
            {`${label} `}
            <select onChange={handler}>
              {multiplierOptions}
            </select>
          </label>
        ))}
      </div>
      <List>
        {quests.slice(0, limit).map(({ id, score }) => (
          <Quest key={id} id={id} score={score} />
        ))}
      </List>
      {quests.length > limit && (
        <LoadMore type="button" onClick={handleLoadMore}>
          {intl.formatMessage({ id: 'recommended-quests.load-more' })}
        </LoadMore>
      )}
    </section>
  );
}
