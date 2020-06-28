import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import { Instance } from 'mobx-state-tree';
import React from 'react';

import { Unit as UnitData, orderUnits } from '../resources/units';
import { useStateContext } from '../state';
import UnitState from '../state/unit';

import UnitEquips from './UnitEquips';
import { useResource } from './Wrapper';

const Title = styled('h2')`
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

const Description = styled('p')`
  margin-bottom: 24px;
`;

const Wrapper = styled('ul')<{ pending?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: center;
  grid-gap: 16px;
  gap: 16px;

  &.pending {
    opacity: 0.5;
    transition: opacity 0.2s 0.1s;
  }
`;

export default function UnitEquipList() {
  const unitData = useResource('unit').get();
  const intl = useIntl();
  const rootState = useStateContext();
  const pending = useResource('pending');
  const units = useObserver(() => {
    const unitDataAndState = [...rootState.units.values()]
      .map(state => {
        const data = unitData.get(state.id);
        if (data == null) {
          return null;
        }
        return {
          ...data,
          unitState: state,
        };
      })
      .filter(data => data != null) as
        (UnitData & { unitState: Instance<typeof UnitState> })[];
    const sortedUnitData = orderUnits(unitDataAndState, { orderBy: 'search' });
    return sortedUnitData
      .map(({ id, unitState }) => ({
        id,
        unit: unitState,
      }))
  });
  return (
    <section>
      <Title>{intl.formatMessage({ id: 'rank-equipments.title' })}</Title>
      <Description>
        {intl.formatMessage(
          { id: 'rank-equipments.description' },
          { count: units.length },
        )}
      </Description>
      <Wrapper pending={pending}>
        {units.map(({ id, unit }) => <UnitEquips key={id} unit={unit} />)}
      </Wrapper>
    </section>
  );
}
