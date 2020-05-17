import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Unit {
  id: string;
  name: string;
  equips: string[][];
}

const units = new RemoteResource(async () => {
  const resp = await fetch(withPrefix('/data/unit.json'));
  const unitData: Unit[] = (await resp.json()).$data;
  const unitDataFiltered = unitData.filter(unit => {
    return (
      unit.id[0] === '1' &&
      unit.equips.every((equip: string[]) => equip.join('') !== '000000')
    );
  });
  return new Map(unitDataFiltered.map(unit => [unit.id, unit]));
});
export default units;

export function getEquipsForRank(id: string, rank: number): string[] | null {
  return units.get().get(id)?.equips[rank - 1] || null;
}
