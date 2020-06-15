import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { useStateContext } from '../state';

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
  const intl = useIntl();
  const rootState = useStateContext();
  const pending = useResource('pending');
  const units = useObserver(() => (
    [...rootState.units.values()]
      .map(unit => ({
        id: unit.id,
        unit,
      }))
  ));
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
