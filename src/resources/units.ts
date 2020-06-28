import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Unit {
  id: string;
  name: string;
  search: string;
  equips: string[][];
}

export function loadUnits(region: string): RemoteResource<Map<string, Unit>> {
  return new RemoteResource(async () => {
    const resp = await fetch(withPrefix(`/data/${region}/unit.json`));
    const unitData: Unit[] = (await resp.json()).$data;
    const unitDataFiltered = unitData.filter(unit => {
      return (
        unit.id[0] === '1' &&
        unit.equips.every((equip: string[]) => equip.join('') !== '000000')
      );
    });
    return new Map(unitDataFiltered.map(unit => [unit.id, unit]));
  });
}

type OrderUnitsBy =
  | 'id'
  | 'name'
  | 'search'
;

type OrderUnitsDirection = 'asc' | 'desc';

interface OrderUnitsOptions {
  orderBy?: OrderUnitsBy;
  orderDirection?: OrderUnitsDirection;
}

export function orderUnits<UnitType extends Unit>(
  units: Iterable<UnitType>,
  options: OrderUnitsOptions,
): UnitType[] {
  const { orderBy = 'id', orderDirection = 'asc' } = options;
  const unitList = [...units];
  unitList.sort((a, b) => {
    let valueA: any;
    let valueB: any;
    switch (orderBy) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'search':
        valueA = a.search;
        valueB = b.search;
        break;
      default:
        valueA = a.id;
        valueB = b.id;
        break;
    }
    if (valueA === valueB) {
      const val = Number(a.id) - Number(b.id);
      return orderDirection === 'asc' ? val : -val;
    }
    if (valueA > valueB) {
      return orderDirection === 'asc' ? 1 : -1;
    }
    return orderDirection === 'asc' ? -1 : 1;
  });
  return unitList;
}

export function getEquipsForRank(
  id: string,
  rank: number,
  units: Map<string, Unit>,
): string[] | null {
  return units.get(id)?.equips[rank - 1] || null;
}

export function matchQuery(unit: Unit, query: string): boolean {
  return unit.search.startsWith(query);
}
