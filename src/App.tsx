import React, { useState } from 'react';
import { GameHUD } from './components/GameHUD';
import { GameGrid } from './components/GameGrid';
import { HeroShop } from './components/HeroShop';
import { HeroPanel } from './components/HeroPanel';
import { useGameState } from './hooks/useGameState';
import { Position, HeroType } from './types/game';
import { HERO_PLACEMENT_ZONES, ENEMY_PATH, HERO_STATS } from './data/heroStats';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

function App() {
  const {
    gameState,
    updateGameState,
    selectHero,
    placeHero,
    sellHero,
    setHoveredCell,
    canPlaceHeroAt
  } = useGameState();

  const [selectedHeroType, setSelectedHeroType] = useState<HeroType | null>(null);
  const { toast } = useToast();

  const handleStartWave = () => {
    if (gameState.heroes.length === 0) {
      toast({
        title: "Aucun héros placé",
        description: "Placez au moins un héros avant de commencer la vague !",
        variant: "destructive"
      });
      return;
    }

    updateGameState({ 
      isWaveActive: true,
      wave: gameState.wave + 1
    });
    
    toast({
      title: `Vague ${gameState.wave} commencée !`,
      description: "Défendez votre base contre les ennemis.",
    });
  };

  const handleTogglePause = () => {
    updateGameState({ isPaused: !gameState.isPaused });
  };

  const handleCellClick = (position: Position) => {
    // Si on a sélectionné un type de héros, essayer de le placer
    if (selectedHeroType) {
      // Vérifier si c'est sur le chemin (interdit)
      const isOnPath = ENEMY_PATH.some(
        pathCell => pathCell.x === position.x && pathCell.y === position.y
      );
      
      if (isOnPath) {
        toast({
          title: "Placement invalide",
          description: "Vous ne pouvez pas placer de héros sur le chemin des ennemis.",
          variant: "destructive"
        });
        return;
      }

      // Vérifier s'il y a déjà un héros à cette position
      const hasHero = gameState.heroes.some(hero => 
        hero.position.x === position.x && hero.position.y === position.y
      );
      
      if (hasHero) {
        toast({
          title: "Position occupée",
          description: "Il y a déjà un héros à cette position.",
          variant: "destructive"
        });
        return;
      }

      const success = placeHero(selectedHeroType, position);
      if (success) {
        setSelectedHeroType(null);
        toast({
          title: "Héros placé !",
          description: `${HERO_STATS[selectedHeroType].name} placé avec succès.`,
        });
      } else {
        toast({
          title: "Or insuffisant",
          description: "Vous n'avez pas assez d'PO pour acheter ce héros.",
          variant: "destructive"
        });
      }
    } else {
      // Sinon, désélectionner le héros actuel
      selectHero(null);
    }
  };

  const handleHeroClick = (hero: any) => {
    selectHero(hero);
    setSelectedHeroType(null);
  };

  const handlePurchaseHero = (heroType: HeroType) => {
    setSelectedHeroType(heroType);
    toast({
      title: "Héros sélectionné",
      description: "Cliquez sur une case libre pour placer votre héros.",
    });
  };

  const handleSellHero = (heroId: string) => {
    sellHero(heroId);
    toast({
      title: "Héros vendu",
      description: "Vous avez récupéré une partie de votre investissement.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* HUD supérieur */}
      <GameHUD
        gameState={gameState}
        onStartWave={handleStartWave}
        onTogglePause={handleTogglePause}
      />

      {/* Zone de jeu principale */}
      <div className="flex-1 flex">
        {/* Boutique de héros */}
        <HeroShop
          gold={gameState.gold}
          selectedHeroType={selectedHeroType}
          onSelectHeroType={setSelectedHeroType}
          onBuyHero={handlePurchaseHero}
        />

        {/* Grille de jeu */}
        <GameGrid
          heroes={gameState.heroes}
          selectedHero={gameState.selectedHero}
          hoveredCell={gameState.hoveredCell}
          selectedHeroType={selectedHeroType}
          showRange={gameState.showRange}
          onCellClick={handleCellClick}
          onCellHover={(position) => {
            setHoveredCell(position);
            updateGameState({ 
              hoveredCell: position,
              showRange: selectedHeroType !== null && position !== null
            });
          }}
          onHeroClick={handleHeroClick}
        />

        {/* Panneau d'informations du héros */}
        <HeroPanel
          selectedHero={gameState.selectedHero}
          onSellHero={handleSellHero}
        />
      </div>

      <Toaster />
    </div>
  );
}

export default App;