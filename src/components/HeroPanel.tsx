import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Hero } from '../types/game';
import { HERO_STATS } from '../data/heroStats';
import { Sword, Target, Zap, Star, Coins, Trash2, Circle, Minus, Crosshair, Clock } from 'lucide-react';

interface HeroPanelProps {
  selectedHero: Hero | null;
  onSellHero: (heroId: string) => void;
  onUpgradeHero?: (heroId: string) => void;
}

export const HeroPanel: React.FC<HeroPanelProps> = ({
  selectedHero,
  onSellHero,
  onUpgradeHero
}) => {
  if (!selectedHero) {
    return (
      <div className="w-80 bg-slate-900/90 backdrop-blur-sm border-l border-purple-500/20 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-2">Aucun héros sélectionné</p>
            <p className="text-sm">Cliquez sur un héros pour voir ses détails</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = HERO_STATS[selectedHero.type];
  const experiencePercent = (selectedHero.experience / (selectedHero.level * 100)) * 100;

  return (
    <div className="w-80 bg-slate-900/90 backdrop-blur-sm border-l border-purple-500/20 p-4 space-y-4">
      {/* En-tête du héros */}
      <Card className="bg-slate-800/50 border-purple-500/30 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: stats.color + '20', border: `2px solid ${stats.color}` }}
          >
            {stats.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{stats.name}</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: stats.color, color: stats.color }}
              >
                Niveau {selectedHero.level}
              </Badge>
              <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                {stats.damageType === 'physical' ? 'Physique' : 'Magique'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Barre d'expérience */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Expérience</span>
              <span>{selectedHero.experience}/{selectedHero.level * 100}</span>
            </div>
            <Progress 
              value={experiencePercent} 
              className="h-2"
              style={{ 
                backgroundColor: '#1e293b',
                '--progress-foreground': '#8b5cf6'
              } as React.CSSProperties}
            />
          </div>
        </div>
      </Card>

      {/* Statistiques */}
      <Card className="bg-slate-800/50 border-slate-600 p-4">
        <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
          <Sword className="w-4 h-4" />
          Statistiques
        </h4>
        
        <div className="space-y-3 text-sm">
          {/* Dégâts et Portée */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-red-400" />
              <span className="text-slate-400">Dégâts:</span>
              <span className="text-white font-medium">{selectedHero.damage}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">Portée:</span>
              <span className="text-white font-medium">{selectedHero.range.min}-{selectedHero.range.max}</span>
            </div>
          </div>

          {/* Vitesse d'attaque et Précision */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-400">Vitesse:</span>
              <span className="text-white font-medium">{selectedHero.attackSpeed}/s</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-green-400" />
              <span className="text-slate-400">Précision:</span>
              <span className="text-white font-medium">{selectedHero.accuracy}%</span>
            </div>
          </div>

          {/* Critique et Dégâts critique */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">Critique:</span>
              <span className="text-white font-medium">{selectedHero.criticalChance}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400">Dég. crit:</span>
              <span className="text-white font-medium">{selectedHero.criticalDamage}%</span>
            </div>
          </div>

          {/* Forme d'attaque et Cibles max */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              {selectedHero.rangeShape === 'circle' ? 
                <Circle className="w-4 h-4 text-cyan-400" /> : 
                <Minus className="w-4 h-4 text-cyan-400" />
              }
              <span className="text-slate-400">Forme:</span>
              <span className="text-white font-medium">{selectedHero.rangeShape === 'circle' ? 'Cercle' : 'Ligne'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-pink-400" />
              <span className="text-slate-400">Cibles max:</span>
              <span className="text-white font-medium">{selectedHero.maxTargets}</span>
            </div>
          </div>

          {/* AOE Radius si applicable */}
          {selectedHero.aoeRadius && (
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">Rayon AOE:</span>
              <span className="text-white font-medium">{selectedHero.aoeRadius} cases</span>
            </div>
          )}
        </div>
      </Card>

      {/* Compétences */}
      <Card className="bg-slate-800/50 border-slate-600 p-4">
        <h4 className="text-sm font-medium text-purple-400 mb-3">Compétences</h4>
        
        {selectedHero.abilities.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            Aucune compétence débloquée
          </p>
        ) : (
          <div className="space-y-2">
            {selectedHero.abilities.map((ability) => (
              <div key={ability.id} className="p-2 bg-slate-700/50 rounded border border-slate-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-white">{ability.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Niv. {ability.level}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{ability.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Separator className="bg-slate-600" />

      {/* Actions */}
      <div className="space-y-2">
        {onUpgradeHero && selectedHero.level < 5 && (
          <Button
            onClick={() => onUpgradeHero(selectedHero.id)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            size="sm"
          >
            <Star className="w-4 h-4 mr-2" />
            Améliorer (Niv. {selectedHero.level + 1})
          </Button>
        )}
        
        <Button
          onClick={() => onSellHero(selectedHero.id)}
          variant="outline"
          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
          size="sm"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Vendre
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3" />
              <span className="text-xs">{selectedHero.sellValue} PO</span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};