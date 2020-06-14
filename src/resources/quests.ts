import { withPrefix } from 'gatsby';

import RemoteResource from '../utils/RemoteResource';

export interface Quest {
  id: string;
  name: string;
  stamina: number;
  wave_groups: WaveGroup[];
}

export interface WaveGroup {
  id: string;
  waves: Wave[]
}

export interface Wave {
  id: string;
  odds: number;
  enemies: Enemy[];
}

export interface Enemy {
  enemy_id: string;
  drop_mana: number;
  drop_reward: RewardData | null;
}

export interface RewardData {
  id: string;
  drop_count: number;
  possible_drops: DropData[];
}

export interface DropData {
  odds: number;
  count: number;
  reward: Reward;
}

export interface RewardNothing {
  type: 'nothing';
}

export interface RewardItem {
  type: 'item';
  id: string;
}

export interface RewardEquipment {
  type: 'equipment';
  id: string;
}

export type Reward = RewardNothing | RewardItem | RewardEquipment;

export function calculateDrops(quest: Quest): DropData[][] {
  return quest.wave_groups.flatMap(wg => (
    wg.waves.flatMap(wave => (
      wave.enemies.flatMap(enemy => {
        const dropReward = enemy.drop_reward;
        if (dropReward == null) {
          return [];
        }
        return Array(dropReward.drop_count)
          .fill(0)
          .map(() => (
            dropReward.possible_drops
              .map(drop => ({
                ...drop,
                odds: drop.odds * wave.odds / 100,
              }))
          ))
      })
    ))
  ));
}

export interface QuestMaps {
  idQuestMap: Map<string, Quest>;
  equipQuestMap: Map<string, string[]>;
}

export function loadQuests(region: string): RemoteResource<QuestMaps> {
  return new RemoteResource<QuestMaps>(async () => {
    const resp = await fetch(withPrefix(`/data/${region}/quest.json`));
    const questData: Quest[] = (await resp.json()).$data;
    const idQuestMap = new Map(questData.map(quest => [quest.id, quest]));
    const equipQuestMap = new Map<string, string[]>();
    for (const quest of questData) {
      const drops = calculateDrops(quest);
      const equipments = drops
        .flat()
        .map(drop => drop.reward)
        .filter(reward => reward.type === 'equipment') as RewardEquipment[];
      const id = quest.id;
      for (const { id: equipmentId } of equipments) {
        const quests = equipQuestMap.get(equipmentId) ?? [];
        quests.push(id);
        equipQuestMap.set(equipmentId, quests);
      }
    }
    return {
      idQuestMap,
      equipQuestMap,
    };
  });
}

function scoreQuest(quest: Quest, equipmentIdMap: Map<string, number>) {
  const dropData = calculateDrops(quest);
  return dropData
    .map(dropGroup => {
      const scores = dropGroup.map(drop => {
        if (drop.reward.type !== 'equipment') {
          return {
            odds: drop.odds,
            count: 0,
          };
        }
        const count = equipmentIdMap.get(drop.reward.id) ?? 0;
        return {
          odds: drop.odds,
          count: drop.count * count,
        };
      }).filter(({ count }) => count > 0);
      const count = scores.length;
      if (count <= 0) {
        return 0;
      }
      const sumOdds = scores.reduce((a, b) => a + b.odds, 0);
      const sumCount = scores.reduce((a, b) => a + b.count, 0);
      return sumOdds * sumCount / count;
    })
    .reduce((a, b) => a + b, 0) / quest.stamina;
}

export interface Multipliers {
  normal?: number;
  hard?: number;
  veryHard?: number;
}

export interface RankQuestsOptions {
  questMaps: QuestMaps;
  multipliers?: Multipliers;
}

export function rankQuests(
  equipmentIdMap: Map<string, number>,
  options: RankQuestsOptions,
): { id: string; score: number }[] {
  let questMaps = options.questMaps;
  const {
    normal: normalMultiplier = 1,
    hard: hardMultiplier = 1,
    veryHard: veryHardMultiplier = 1,
  } = options.multipliers || {};

  const { idQuestMap, equipQuestMap } = questMaps;
  const equipmentIds = [...equipmentIdMap.keys()];
  const questIds = new Set(
    equipmentIds.flatMap(id => equipQuestMap.get(id) ?? [])
  );
  const scoredQuests = [...questIds].map(id => {
    const quest = idQuestMap.get(id);
    if (quest == null) {
      return {
        id,
        score: 0,
      };
    }
    const score = scoreQuest(quest, equipmentIdMap);
    const multiplier = [, normalMultiplier, hardMultiplier, veryHardMultiplier][Number(id[1])] || 1;
    return {
      id,
      score: score * multiplier,
    };
  });
  scoredQuests.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.id < b.id ? -1 : a.id === b.id ? 0 : 1;
  });
  return scoredQuests;
}
