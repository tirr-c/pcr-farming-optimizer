import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Unit {
  id: string;
  name: string;
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

export function getEquipsForRank(
  id: string,
  rank: number,
  units: Map<string, Unit>,
): string[] | null {
  return units.get(id)?.equips[rank - 1] || null;
}
