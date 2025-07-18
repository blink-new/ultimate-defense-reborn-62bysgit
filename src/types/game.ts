// Types pour le jeu Ultimate Defense Reborn

export interface Position {
  x: number;
  y: number;
}

export interface Hero {
  id: string;
  type: HeroType;
  position: Position;
  level: number;
  experience: number;
  damage: number;
  range: { min: number; max: number };
  attackSpeed: number;
  cost: number;
  sellValue: number;
  abilities: Ability[];
  passives: Passive[];
  isSelected: boolean;
  lastAttackTime: number;
  rangeShape: 'line' | 'circle';
  attackType: 'single' | 'aoe';
  maxTargets: number;
  aoeRadius?: number;
  accuracy: number;
  criticalChance: number;
  criticalDamage: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  health: number;
  maxHealth: number;
  speed: number;
  armor: number;
  magicResist: number;
  bounty: number;
  pathIndex: number;
  effects: Effect[];
  isFlying: boolean;
  isStealth: boolean;
  hasShield: boolean;
  shieldHealth: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  lastUsed: number;
  manaCost: number;
  level: number;
  maxLevel: number;
}

export interface Passive {
  id: string;
  name: string;
  description: string;
  effect: string;
  value: number;
  level: number;
}

export interface Effect {
  id: string;
  type: EffectType;
  duration: number;
  value: number;
  startTime: number;
}

export interface GameState {
  gold: number;
  lives: number;
  wave: number;
  isWaveActive: boolean;
  isPaused: boolean;
  heroes: Hero[];
  enemies: Enemy[];
  selectedHero: Hero | null;
  hoveredCell: Position | null;
  showRange: boolean;
  gameSpeed: number;
}

export interface Cell {
  position: Position;
  type: CellType;
  isPath: boolean;
  canPlaceHero: boolean;
  hero: Hero | null;
  pathIndex?: number;
}

export type HeroType = 'warrior' | 'archer' | 'mage' | 'priest';
export type EnemyType = 'basic' | 'fast' | 'armored' | 'flying' | 'stealth' | 'boss';
export type CellType = 'empty' | 'path' | 'spawn' | 'goal' | 'blocked';
export type EffectType = 'stun' | 'slow' | 'poison' | 'burn' | 'freeze' | 'buff';

export interface HeroStats {
  type: HeroType;
  name: string;
  description: string;
  baseCost: number;
  baseDamage: number;
  baseRange: { min: number; max: number };
  attackSpeed: number;
  damageType: 'physical' | 'magical';
  icon: string;
  color: string;
  rangeShape: 'line' | 'circle';
  attackType: 'single' | 'aoe';
  maxTargets: number;
  aoeRadius?: number;
  baseAccuracy: number;
  baseCriticalChance: number;
  baseCriticalDamage: number;
}

export interface WaveData {
  wave: number;
  enemies: {
    type: EnemyType;
    count: number;
    spawnDelay: number;
  }[];
  goldBonus: number;
}