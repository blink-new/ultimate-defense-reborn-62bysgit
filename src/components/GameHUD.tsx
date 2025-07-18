import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Heart, Coins, Zap, Play, Pause } from 'lucide-react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
  onStartWave: () => void;
  onTogglePause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameState,
  onStartWave,
  onTogglePause
}) => {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-sm border-b border-purple-500/20 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Stats du joueur */}
        <div className="flex items-center gap-6">
          <Card className="bg-slate-800/50 border-red-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">{gameState.lives}</span>
              <span className="text-slate-400 text-sm">Vies</span>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-amber-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium text-lg">
                {gameState.gold.toLocaleString()}
              </span>
              <span className="text-slate-400 text-sm">PO</span>
            </div>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">Vague {gameState.wave}</span>
            </div>
          </Card>
        </div>

        {/* Titre du jeu */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            Ultimate Defense Reborn
          </h1>
          <p className="text-slate-400 text-sm">Tower Defense Stratégique</p>
        </div>

        {/* Contrôles de jeu */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onTogglePause}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:border-purple-400 text-slate-300"
            disabled={!gameState.isWaveActive}
          >
            {gameState.isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={onStartWave}
            disabled={gameState.isWaveActive}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6"
          >
            {gameState.isWaveActive ? 'Vague en cours...' : `Démarrer Vague ${gameState.wave}`}
          </Button>
        </div>
      </div>
    </div>
  );
};