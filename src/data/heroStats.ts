import { HeroStats, HeroType } from '../types/game';

export const HERO_STATS: Record<HeroType, HeroStats> = {
  warrior: {
    type: 'warrior',
    name: 'Guerrier',
    description: 'Guerrier infligeant de lourds dégâts en mêlée avec son épée.',
    baseCost: 500,
    baseDamage: 12,
    baseRange: { min: 1, max: 1 },
    attackSpeed: 1.2,
    damageType: 'physical',
    icon: '⚔️',
    color: '#DC2626',
    rangeShape: 'line',
    attackType: 'single',
    maxTargets: 2,
    baseAccuracy: 90,
    baseCriticalChance: 15,
    baseCriticalDamage: 150
  },
  archer: {
    type: 'archer',
    name: 'Archer',
    description: 'DPS à distance avec portée précise',
    baseCost: 300,
    baseDamage: 5,
    baseRange: { min: 3, max: 3 },
    attackSpeed: 1.8,
    damageType: 'physical',
    icon: '🏹',
    color: '#059669',
    rangeShape: 'circle',
    attackType: 'single',
    maxTargets: 1,
    baseAccuracy: 95,
    baseCriticalChance: 25,
    baseCriticalDamage: 200
  },
  mage: {
    type: 'mage',
    name: 'Mage',
    description: 'Mage infligeant des attaques de zone. Sa portée est de 0 : il attaque sa propre case et touche les 8 cases autour.',
    baseCost: 700,
    baseDamage: 8,
    baseRange: { min: 0, max: 0 },
    attackSpeed: 1.5,
    damageType: 'magical',
    icon: '🔮',
    color: '#7C3AED',
    rangeShape: 'circle',
    attackType: 'aoe',
    maxTargets: 5,
    aoeRadius: 1,
    baseAccuracy: 85,
    baseCriticalChance: 10,
    baseCriticalDamage: 180
  },
  priest: {
    type: 'priest',
    name: 'Prêtre',
    description: 'Support économique et buffs alliés',
    baseCost: 1500,
    baseDamage: 3,
    baseRange: { min: 1, max: 3 },
    attackSpeed: 1.0,
    damageType: 'magical',
    icon: '✨',
    color: '#F59E0B',
    rangeShape: 'circle',
    attackType: 'single',
    maxTargets: 1,
    baseAccuracy: 80,
    baseCriticalChance: 5,
    baseCriticalDamage: 120
  }
};

export const GRID_WIDTH = 18;
export const GRID_HEIGHT = 18;
export const CELL_SIZE = 30;

// Chemin prédéfini pour les ennemis (grille 18x18 carrée)
export const ENEMY_PATH: Array<{ x: number; y: number }> = [
  { x: 0, y: 9 },   // Spawn
  { x: 1, y: 9 },
  { x: 2, y: 9 },
  { x: 3, y: 9 },
  { x: 4, y: 9 },
  { x: 5, y: 9 },
  { x: 5, y: 8 },
  { x: 5, y: 7 },
  { x: 5, y: 6 },
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 8, y: 5 },
  { x: 9, y: 5 },
  { x: 10, y: 5 },
  { x: 11, y: 5 },
  { x: 12, y: 5 },
  { x: 12, y: 6 },
  { x: 12, y: 7 },
  { x: 12, y: 8 },
  { x: 12, y: 9 },
  { x: 12, y: 10 },
  { x: 12, y: 11 },
  { x: 12, y: 12 },
  { x: 13, y: 12 },
  { x: 14, y: 12 },
  { x: 15, y: 12 },
  { x: 16, y: 12 },
  { x: 17, y: 12 }   // Goal
];

// Génération automatique des zones de placement (toutes les cases sauf le chemin)
export const HERO_PLACEMENT_ZONES: Array<{ x: number; y: number }> = (() => {
  const zones: Array<{ x: number; y: number }> = [];
  
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      // Vérifier si cette case n'est pas sur le chemin
      const isOnPath = ENEMY_PATH.some(pathCell => pathCell.x === x && pathCell.y === y);
      if (!isOnPath) {
        zones.push({ x, y });
      }
    }
  }
  
  return zones;
})();