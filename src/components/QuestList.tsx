import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { Multipliers, rankQuests } from '../resources/quests';
import { useStateContext } from '../state';

import MultiplierOptions from './MultiplierOptions';
import Quest from './Quest';
import { useResource } from './Wrapper';

const Title = styled('h2')`
  margin-top: 16px;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

const OptionsList = styled('div')`
  display: flex;
  flex-wrap: wrap;

  > * {
    flex: 1;
    margin-right: 6px;
    margin-bottom: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const List = styled('ul')<{ pending?: boolean }>`
  > * + * {
    margin-top: 12px;
  }

  &.pending {
    opacity: 0.5;
    transition: opacity 0.2s 0.1s;
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
  const pending = useResource('pending');
  const rootState = useStateContext();
  const equipmentIdMap = useObserver(
    () => rootState.allBaseIngredientsExcludedWithResource(unitData, equipmentData)
  );
  const quests = React.useMemo(
    () => rankQuests(equipmentIdMap, { questMaps, multipliers }),
    [equipmentIdMap, questMaps, multipliers],
  );
  const featuredQuests = quests.featured;
  const restQuests = quests.rest;

  const handleLoadMore = React.useCallback(() => {
    setLimit(limit => limit + 5);
  }, []);

  const handleNormalChange = React.useCallback(
    (multiplier: number) => updateMultiplier({ normal: multiplier }),
    [],
  );
  const handleHardChange = React.useCallback(
    (multiplier: number) => updateMultiplier({ hard: multiplier }),
    [],
  );
  const handleVeryHardChange = React.useCallback(
    (multiplier: number) => updateMultiplier({ veryHard: multiplier }),
    [],
  );

  const multiplierMap: [string, number, (multiplier: number) => void][] = [
    ['difficulty.nm', multipliers.normal || 1, handleNormalChange],
    ['difficulty.hd', multipliers.hard || 1, handleHardChange],
    ['difficulty.vh', multipliers.veryHard || 1, handleVeryHardChange],
  ];
  return (
    <section>
      <Title>{intl.formatMessage({ id: 'recommended-quests.title' })}</Title>
      <OptionsList>
        {multiplierMap.map(([labelId, value, handler], idx) => (
          <MultiplierOptions
            key={idx}
            label={intl.formatMessage({ id: labelId })}
            multiplier={value}
            onChange={handler}
          />
        ))}
      </OptionsList>
      <List pending={pending}>
        {featuredQuests.slice(0, limit).map(({ id, score }) => (
          <Quest key={id} id={id} score={score} />
        ))}
        {featuredQuests.length < limit && (
          <>
            <hr />
            {restQuests.slice(0, limit - featuredQuests.length).map(({ id, score }) => (
              <Quest key={id} id={id} score={score} />
            ))}
          </>
        )}
      </List>
      {featuredQuests.length + restQuests.length > limit && (
        <LoadMore type="button" onClick={handleLoadMore}>
          {intl.formatMessage({ id: 'recommended-quests.load-more' })}
        </LoadMore>
      )}
    </section>
  );
}

