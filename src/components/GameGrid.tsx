import React from 'react';
import { Position, Hero, HeroType } from '../types/game';
import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, ENEMY_PATH, HERO_PLACEMENT_ZONES, HERO_STATS } from '../data/heroStats';

interface GameGridProps {
  heroes: Hero[];
  selectedHero: Hero | null;
  hoveredCell: Position | null;
  selectedHeroType: HeroType | null;
  showRange: boolean;
  onCellClick: (position: Position) => void;
  onCellHover: (position: Position | null) => void;
  onHeroClick: (hero: Hero) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  heroes,
  selectedHero,
  hoveredCell,
  selectedHeroType,
  showRange,
  onCellClick,
  onCellHover,
  onHeroClick
}) => {
  const isPathCell = (x: number, y: number): boolean => {
    return ENEMY_PATH.some(pathCell => pathCell.x === x && pathCell.y === y);
  };

  const isPlacementZone = (x: number, y: number): boolean => {
    return HERO_PLACEMENT_ZONES.some(zone => zone.x === x && zone.y === y);
  };

  const getHeroAt = (x: number, y: number): Hero | null => {
    return heroes.find(hero => hero.position.x === x && hero.position.y === y) || null;
  };

  const isInRange = (heroPos: Position, targetPos: Position, range: { min: number; max: number }, rangeShape: 'line' | 'circle'): boolean => {
    const distance = Math.abs(heroPos.x - targetPos.x) + Math.abs(heroPos.y - targetPos.y);
    
    if (rangeShape === 'circle') {
      // Forme cercle : peut attaquer dans toutes les directions
      return distance >= range.min && distance <= range.max;
    } else {
      // Forme ligne : attaque uniquement en ligne droite (même ligne ou colonne)
      const isInLine = (heroPos.x === targetPos.x) || (heroPos.y === targetPos.y);
      return isInLine && distance >= range.min && distance <= range.max;
    }
  };

  const shouldShowRange = (x: number, y: number): boolean => {
    if (!showRange) return false;
    
    // Affichage de portée pour héros sélectionné
    if (selectedHero) {
      return isInRange(selectedHero.position, { x, y }, selectedHero.range, selectedHero.rangeShape);
    }
    
    // Affichage de portée pendant le placement
    if (selectedHeroType && hoveredCell) {
      const stats = HERO_STATS[selectedHeroType];
      return isInRange(hoveredCell, { x, y }, stats.baseRange, stats.rangeShape);
    }
    
    return false;
  };

  const getCellClassName = (x: number, y: number): string => {
    const baseClasses = "relative transition-all duration-200 cursor-pointer";
    const hero = getHeroAt(x, y);
    const isOnPath = isPathCell(x, y);
    
    if (isOnPath) {
      // Style chemin - couleur terre/sable
      return `${baseClasses} bg-amber-600 border border-amber-500/50 hover:bg-amber-500`;
    }
    
    if (hero) {
      // Case avec héros - fond neutre
      return `${baseClasses} bg-slate-700 border border-slate-500 hover:bg-slate-600`;
    }
    
    if (selectedHeroType && hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
      // Case survolée pendant le placement
      if (isOnPath) {
        return `${baseClasses} bg-red-600/60 border border-red-400 hover:bg-red-500/70 shadow-lg shadow-red-400/30`;
      } else {
        return `${baseClasses} bg-emerald-600/60 border border-emerald-400 hover:bg-emerald-500/70 shadow-lg shadow-emerald-400/30`;
      }
    }
    
    // Style herbe pour les zones libres - vert naturel
    return `${baseClasses} bg-green-700 border border-green-600/50 hover:bg-green-600`;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div 
        className="grid p-4 bg-slate-900/80 rounded-xl border border-purple-500/30 backdrop-blur-sm shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
          gap: '0px'
        }}
      >
        {Array.from({ length: GRID_HEIGHT }, (_, y) =>
          Array.from({ length: GRID_WIDTH }, (_, x) => {
            const hero = getHeroAt(x, y);
            const showRangeHighlight = shouldShowRange(x, y);
            
            return (
              <div
                key={`${x}-${y}`}
                className={getCellClassName(x, y)}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                onClick={() => onCellClick({ x, y })}
                onMouseEnter={() => onCellHover({ x, y })}
                onMouseLeave={() => onCellHover(null)}
              >
                {/* Indicateur de portée */}
                {showRangeHighlight && (
                  <div className="absolute inset-0 bg-purple-400/30 border-2 border-purple-400/70 rounded-sm animate-pulse shadow-lg shadow-purple-500/30" />
                )}
                
                {/* Héros */}
                {hero && (
                  <div
                    className={`absolute inset-0.5 rounded-md flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200 shadow-lg ${
                      hero.isSelected 
                        ? 'scale-110 shadow-xl' 
                        : 'hover:scale-105 shadow-md'
                    }`}
                    style={{ 
                      backgroundColor: hero.isSelected ? HERO_STATS[hero.type].color + 'CC' : HERO_STATS[hero.type].color + '99',
                      borderColor: HERO_STATS[hero.type].color,
                      border: `2px solid ${HERO_STATS[hero.type].color}`,
                      boxShadow: hero.isSelected 
                        ? `0 0 20px ${HERO_STATS[hero.type].color}66, 0 4px 12px rgba(0,0,0,0.4)` 
                        : `0 2px 8px rgba(0,0,0,0.3)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHeroClick(hero);
                    }}
                  >
                    <span className="text-white drop-shadow-lg">{HERO_STATS[hero.type].icon}</span>
                    
                    {/* Niveau du héros */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 text-black text-xs rounded-full flex items-center justify-center font-bold shadow-md border border-amber-300">
                      {hero.level}
                    </div>
                  </div>
                )}
                
                {/* Indicateur de spawn */}
                {x === 0 && y === 9 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-green-300 animate-pulse">
                      S
                    </div>
                  </div>
                )}
                
                {/* Indicateur de goal */}
                {x === 17 && y === 12 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-red-300 animate-pulse">
                      G
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};