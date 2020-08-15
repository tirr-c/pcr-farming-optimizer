import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  promotion_level: 'blue' | 'bronze' | 'silver' | 'gold' | 'purple' | 'red' | 'special';
  craft: {
    cost: number;
    ingredients: {
      id: string;
      count: number;
    }[];
  } | null;
}

export function loadEquipments(
  region: string,
): RemoteResource<Map<string, Equipment>> {
  return new RemoteResource(async () => {
    const resp = await fetch(withPrefix(`/data/${region}/equipment.json`));
    const data: Equipment[] = (await resp.json()).$data;
    return new Map(data.map(eq => [eq.id, eq]));
  });
}

export function computeBaseIngredients(
  equipmentIds: string[],
  equipmentData: Map<string, Equipment>,
): Map<string, number> {
  const ret = new Map();
  let queue = new Map<string, number>();
  for (const equip of equipmentIds) {
    queue.set(equip, (queue.get(equip) || 0) + 1);
  }
  while (queue.size > 0) {
    const newQueue = new Map();
    for (const [equip, count] of queue) {
      const ingredients = equipmentData.get(equip)?.craft?.ingredients;
      if (ingredients == null) {
        ret.set(equip, (ret.get(equip) || 0) + count);
      } else {
        for (const ingredient of ingredients) {
          newQueue.set(ingredient.id, (newQueue.get(ingredient.id) || 0) + ingredient.count * count);
        }
      }
    }
    queue = newQueue;
  }
  return ret;
}
