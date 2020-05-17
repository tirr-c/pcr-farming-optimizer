import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Equipment {
  id: string;
  name: string;
  description: string;
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
