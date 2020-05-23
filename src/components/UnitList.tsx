import styled from 'astroturf';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import units from '../resources/units';
import { useStateContext } from '../state';

import UnitIcon from './UnitIcon';

const TitleAnchor = styled('a')`
  text-decoration: none;
  color: inherit;
`;

const Title = styled('h2')<{ open?: boolean }>`
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;

  &::before {
    content: '>';
    margin-right: 4px;
  }

  &.open::before {
    content: 'v';
  }
`;

const UnitListWrapper = styled('ul')<{ open?: boolean }>`
  max-width: 64px * 8 + 8px * 7;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-rows: 64px;
  grid-gap: 8px;
  gap: 8px;

  display: none;

  &.open {
    display: grid;
  }
`;

export default function UnitList() {
  const unitData = units.get();
  const [isOpen, setOpen] = React.useState(true);
  const handleTitleClick = React.useCallback(() => setOpen(open => !open), []);
  return (
    <section>
      <TitleAnchor onClick={handleTitleClick}>
        <Title open={isOpen}>Characters</Title>
      </TitleAnchor>
      <UnitListWrapper open={isOpen}>
        {[...unitData.values()].map(unit => {
          return (
            <UnitItem
              key={unit.id}
              id={unit.id}
              name={unit.name}
            />
          );
        })}
      </UnitListWrapper>
    </section>
  );
}

function UnitItem(props: { id: string, name: string }) {
  const { id, name } = props;
  const rootState = useStateContext();
  const handleChange = React.useCallback(value => {
    if (value) {
      rootState.addUnit(id);
    } else {
      rootState.removeUnit(id);
    }
  }, [id, rootState]);
  return useObserver(() => (
    <UnitIcon
      unitId={id}
      name={name}
      rarity={1}
      active={rootState.units.has(id)}
      size="small"
      onChange={handleChange}
    />
  ));
}
