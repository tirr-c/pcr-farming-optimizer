import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { useStateContext } from '../state';

import EquipIcon from './EquipIcon';
import { useResource } from './Wrapper';

const Title = styled('h2')<{ open?: boolean }>`
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;
`;

const Description = styled('p')`
  margin-bottom: 24px;
`;

const EquipGrid = styled('ul')<{ pending?: boolean }>`
  display: grid;
  max-width: 48px * 10;
  margin: 0 auto;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 48px);
  grid-auto-rows: 48px;
  grid-gap: 0;
  gap: 0;

  &.pending {
    opacity: 0.5;
    transition: opacity 0.2s 0.1s;
  }
`;

const EquipCount = styled('span')`
  text-shadow: 1px 1px white, -1px 1px white, 1px -1px white, -1px -1px white;
`;

export default function BaseIngredientList() {
  const unitData = useResource('unit').get();
  const equipmentData = useResource('equipment').get();
  const pending = useResource('pending');
  const rootState = useStateContext();
  const baseIngredients = useObserver(
    () => rootState.allBaseIngredientsWithResource(unitData, equipmentData),
  );
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'ingredients.title' });
  const description = intl.formatMessage(
    { id: 'ingredients.description' },
    { count: baseIngredients.size },
  );
  if (baseIngredients.size === 0) {
    return (
      <section>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </section>
    );
  }
  const icons = [...baseIngredients.entries()]
    .sort(([idA], [idB]) => {
      if (idA === idB) {
        return 0;
      }
      const rarityA = Number(idA[2]);
      const rarityB = Number(idB[2]);
      if (rarityA !== rarityB) {
        return rarityA - rarityB;
      }
      const orderA = Number(idA.substring(3));
      const orderB = Number(idB.substring(3));
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return Number(idA[1]) - Number(idB[1]);
    })
    .map(([id, count]) => (
      <li key={id}>
        <InteractiveEquipIcon id={id} count={count} />
      </li>
    ));

  return (
    <section>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <EquipGrid pending={pending}>
        {icons}
      </EquipGrid>
    </section>
  );
}

function InteractiveEquipIcon(props: { id: string; count: number }) {
  const { id, count } = props;
  const equipmentData = useResource('equipment').get();
  const rootState = useStateContext();
  const active = useObserver(() => !rootState.excludedEquips.has(id));
  const handleChange = React.useCallback(value => {
    if (value) {
      rootState.includeEquip(id);
    } else {
      rootState.excludeEquip(id);
    }
  }, [id]);
  return (
    <EquipIcon
      id={id}
      name={equipmentData.get(id)?.name || ''}
      size="small"
      active={active}
      dimInactive
      onChange={handleChange}
    >
      <EquipCount>{count}</EquipCount>
    </EquipIcon>
  );
}
