import { useState, useCallback } from 'react';
import { GameState, Hero, Position, HeroType } from '../types/game';
import { HERO_STATS, HERO_PLACEMENT_ZONES, ENEMY_PATH } from '../data/heroStats';

const INITIAL_GAME_STATE: GameState = {
  gold: 1000,
  lives: 20,
  wave: 1,
  isWaveActive: false,
  isPaused: false,
  heroes: [],
  enemies: [],
  selectedHero: null,
  hoveredCell: null,
  showRange: false,
  gameSpeed: 1
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const selectHero = useCallback((hero: Hero | null) => {
    setGameState(prev => ({
      ...prev,
      selectedHero: hero,
      showRange: hero !== null,
      heroes: prev.heroes.map(h => ({
        ...h,
        isSelected: h.id === hero?.id
      }))
    }));
  }, []);

  const placeHero = useCallback((heroType: HeroType, position: Position) => {
    const stats = HERO_STATS[heroType];
    
    if (gameState.gold < stats.baseCost) {
      return false; // Pas assez d'or
    }

    const newHero: Hero = {
      id: `hero_${Date.now()}_${Math.random()}`,
      type: heroType,
      position,
      level: 1,
      experience: 0,
      damage: stats.baseDamage,
      range: stats.baseRange,
      attackSpeed: stats.attackSpeed,
      cost: stats.baseCost,
      sellValue: Math.floor(stats.baseCost * 0.7),
      abilities: [],
      passives: [],
      isSelected: false,
      lastAttackTime: 0,
      rangeShape: stats.rangeShape,
      attackType: stats.attackType,
      maxTargets: stats.maxTargets,
      aoeRadius: stats.aoeRadius,
      accuracy: stats.baseAccuracy,
      criticalChance: stats.baseCriticalChance,
      criticalDamage: stats.baseCriticalDamage
    };

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - stats.baseCost,
      heroes: [...prev.heroes, newHero]
    }));

    return true;
  }, [gameState.gold]);

  const sellHero = useCallback((heroId: string) => {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    setGameState(prev => ({
      ...prev,
      gold: prev.gold + hero.sellValue,
      heroes: prev.heroes.filter(h => h.id !== heroId),
      selectedHero: prev.selectedHero?.id === heroId ? null : prev.selectedHero
    }));
  }, [gameState.heroes]);

  const setHoveredCell = useCallback((position: Position | null) => {
    setGameState(prev => ({ ...prev, hoveredCell: position }));
  }, []);

  const canPlaceHeroAt = useCallback((position: Position): boolean => {
    // Vérifier si la position n'est pas sur le chemin des ennemis
    const isOnPath = ENEMY_PATH.some(pathCell => 
      pathCell.x === position.x && pathCell.y === position.y
    );
    if (isOnPath) return false;

    // Vérifier qu'il n'y a pas déjà un héros à cette position
    const hasHero = gameState.heroes.some(hero => 
      hero.position.x === position.x && hero.position.y === position.y
    );
    
    return !hasHero;
  }, [gameState.heroes]);

  return {
    gameState,
    updateGameState,
    selectHero,
    placeHero,
    sellHero,
    setHoveredCell,
    canPlaceHeroAt
  };
};