import styled from 'astroturf';
import { useIntl } from 'gatsby-plugin-intl';
import { useObserver } from 'mobx-react-lite';
import React from 'react';

import { matchQuery, orderUnits } from '../resources/units';
import { useStateContext } from '../state';

import UnitIcon from './UnitIcon';
import { useResource } from './Wrapper';

const TitleAnchor = styled('a')`
  text-decoration: none;
  color: inherit;
`;

const Title = styled('h2')<{ open?: boolean }>`
  display: flex;
  align-items: center;

  margin-bottom: 12px;
  font-size: 24px;
  font-weight: bold;

  &::before {
    display: block;
    box-sizing: border-box;
    content: '';
    width: 12px;
    height: 12px;
    margin: 0 10px 6px 4px;
    border: solid black;
    border-width: 0 3px 3px 0;

    transform: rotate(-45deg);
    transform-origin: 75% 75%;
  }

  &.open::before {
    transform: rotate(45deg);
  }
`;

const SearchWrapper = styled('label')`
  width: 100%;
  height: 32px;
  margin: 0 0 12px;
  padding: 3px;

  display: flex;
  align-items: center;

  border: 1px solid black;
  border-radius: 3px;

  &:focus-within {
    outline: auto -webkit-focus-ring-color;
  }
`;

const Search = styled('input')`
  flex: 1;
  appearance: none;
  border: 0;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

Search.defaultProps = {
  type: 'search',
};

const UnitListWrapper = styled('ul')<{ open?: boolean, pending?: boolean }>`
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-rows: 64px;
  grid-gap: 8px;
  gap: 8px;

  display: none;

  &.open {
    display: grid;
  }

  &.pending {
    opacity: 0.5;
    transition: opacity 0.2s 0.1s;
  }
`;

export default function UnitList() {
  const [searchText, setSearchText] = React.useState('');
  const deferredSearchText = (React as any).unstable_useDeferredValue(
    searchText,
    { timeoutMs: 1000 },
  );
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const unitData = useResource('unit').get();
  const pending = useResource('pending');
  const intl = useIntl();
  const rootState = useStateContext();
  const isOpen = useObserver(() => rootState.unitListOpen);
  const handleTitleClick = React.useCallback(() => rootState.toggleUnitListOpen(), []);
  const unitList = orderUnits(unitData.values(), { orderBy: 'search' });
  return (
    <section>
      <TitleAnchor onClick={handleTitleClick}>
        <Title open={isOpen}>{intl.formatMessage({ id: 'characters.title' })}</Title>
      </TitleAnchor>
      {isOpen && (
        <SearchWrapper>
          <Search
            value={searchText}
            placeholder={intl.formatMessage({ id: 'characters.search' })}
            onChange={handleSearchChange}
          />
        </SearchWrapper>
      )}
      <UnitListWrapper open={isOpen} pending={pending}>
        {
          unitList
            .filter(unit => matchQuery(unit, deferredSearchText))
            .map(unit => {
              return (
                <UnitItem
                  key={unit.id}
                  id={unit.id}
                  name={unit.name}
                />
              );
            })
        }
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
      size="medium"
      onChange={handleChange}
    />
  ));
}
