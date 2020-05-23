import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  promotion_level: 'blue' | 'bronze' | 'silver' | 'gold' | 'purple' | 'special';
  craft: {
    cost: number;
    ingredients: {
      id: string;
      count: number;
    }[];
  } | null;
}

const equipments = new RemoteResource(async () => {
  const resp = await fetch(withPrefix('/data/equipment.json'));
  const data: Equipment[] = (await resp.json()).$data;
  return new Map(data.map(eq => [eq.id, eq]));
});
export default equipments;

export function getCraftIngredients(id: string): Map<string, number> {
  const ingredients = equipments.get().get(id)?.craft?.ingredients;
  if (ingredients == null) {
    return new Map();
  }
  return new Map(ingredients.map(item => [item.id, item.count]));
}

export function computeBaseIngredients(equipmentIds: string[]): Map<string, number> {
  const equipmentData = equipments.get();

  const ret = new Map();
  let queue = new Map<string, number>();
  for (const equip of equipmentIds) {
    queue.set(equip, queue.get(equip) || 0 + 1);
  }
  while (queue.size > 0) {
    const newQueue = new Map();
    for (const [equip, count] of queue) {
      const ingredients = equipmentData.get(equip)?.craft?.ingredients;
      if (ingredients == null) {
        ret.set(equip, ret.get(equip) || 0 + count);
      } else {
        for (const ingredient of ingredients) {
          newQueue.set(ingredient.id, newQueue.get(ingredient.id) || 0 + ingredient.count * count);
        }
      }
    }
    queue = newQueue;
  }
  return ret;
}
