import React from 'react';
import { HeroType } from '../types/game';
import { HERO_STATS } from '../data/heroStats';

interface HeroShopProps {
  gold: number;
  onBuyHero: (heroType: HeroType) => void;
  selectedHeroType: HeroType | null;
  onSelectHeroType: (heroType: HeroType | null) => void;
}

export const HeroShop: React.FC<HeroShopProps> = ({
  gold,
  onBuyHero,
  selectedHeroType,
  onSelectHeroType
}) => {
  const heroTypes: HeroType[] = ['archer', 'warrior', 'mage', 'priest'];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 w-80">
      <h3 className="text-lg font-semibold text-white mb-4">🏪 Boutique Héros</h3>
      
      <div className="space-y-3">
        {heroTypes.map(heroType => {
          const stats = HERO_STATS[heroType];
          const canAfford = gold >= stats.baseCost;
          const isSelected = selectedHeroType === heroType;
          
          return (
            <div
              key={heroType}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-purple-400 bg-purple-900/30' 
                  : canAfford 
                    ? 'border-slate-600 bg-slate-700/50 hover:border-slate-500' 
                    : 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                }
              `}
              onClick={() => {
                if (canAfford) {
                  onSelectHeroType(isSelected ? null : heroType);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{stats.icon}</span>
                  <div>
                    <div className="font-medium text-white">{stats.name}</div>
                    <div className="text-sm text-slate-400">
                      💰 {stats.baseCost} PO
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="text-red-400">⚔️ {stats.baseDamage} dégâts</div>
                  <div className="text-blue-400">🎯 {stats.baseRange.min}-{stats.baseRange.max} portée</div>
                  <div className="text-yellow-400">⚡ {stats.attackSpeed}/s</div>
                  <div className="text-green-400">{stats.rangeShape === 'circle' ? '⭕ Cercle' : '📏 Ligne'}</div>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-xs text-slate-300 mb-3">{stats.description}</p>
                  
                  <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-medium text-white mb-2">📊 Statistiques</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-red-400">
                        <span className="text-slate-400">Dégâts:</span> {stats.baseDamage}
                      </div>
                      <div className="text-blue-400">
                        <span className="text-slate-400">Portée:</span> {stats.baseRange.min}-{stats.baseRange.max}
                      </div>
                      <div className="text-yellow-400">
                        <span className="text-slate-400">Vitesse:</span> {stats.attackSpeed}/s
                      </div>
                      <div className="text-green-400">
                        <span className="text-slate-400">Précision:</span> {stats.baseAccuracy}%
                      </div>
                      <div className="text-orange-400">
                        <span className="text-slate-400">Critique:</span> {stats.baseCriticalChance}%
                      </div>
                      <div className="text-purple-400">
                        <span className="text-slate-400">Dég. crit:</span> {stats.baseCriticalDamage}%
                      </div>
                      <div className="text-cyan-400">
                        <span className="text-slate-400">Forme:</span> {stats.rangeShape === 'circle' ? 'Cercle' : 'Ligne'}
                      </div>
                      <div className="text-pink-400">
                        <span className="text-slate-400">Cibles max:</span> {stats.maxTargets}
                      </div>
                      {stats.aoeRadius && (
                        <div className="text-indigo-400 col-span-2">
                          <span className="text-slate-400">Rayon AOE:</span> {stats.aoeRadius} cases
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyHero(heroType);
                      onSelectHeroType(null);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Acheter ({stats.baseCost} PO)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedHeroType && (
        <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700 rounded-lg">
          <p className="text-sm text-purple-200">
            💡 Cliquez sur une case libre pour placer votre héros
          </p>
          <p className="text-xs text-purple-300 mt-1">
            🎯 La portée sera affichée pendant le placement
          </p>
        </div>
      )}
    </div>
  );
};