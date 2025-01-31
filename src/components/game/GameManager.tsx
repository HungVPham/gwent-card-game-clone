import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, PlayerState, GameState, BoardState, RowPosition, CardType, UnitCard, CardAbility, SpecialCard, Faction, LeaderAbility } from '@/types/card';
import GameBoard from './GameBoard';
import { canPlayWeatherInRow, canTriggerMedic, shuffle } from '@/utils/gameHelpers';
import { createInitialDeck } from '@/utils/deckBuilder';
import useAI from '@/hooks/useAI';
import { calculateTotalScore } from '@/utils/gameHelpers';
import { handleDecoyAction, playCard as playCardHelper } from '@/hooks/useGameLogic';
import DisclaimerModal from '../DisclaimerModal';
import React from 'react';

const initialPlayerState: PlayerState = {
  deck: [],
  hand: [],
  discard: [],
  leader: null,
  passed: false,
  lives: 2,
  faction: Faction.NEUTRAL,
  gameScore: 0
};

const initialBoardState: BoardState = {
  close: { cards: [], hornActive: false },
  ranged: { cards: [], hornActive: false },
  siege: { cards: [], hornActive: false }
};

const GameManager = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: initialPlayerState,
    opponent: initialPlayerState,
    playerBoard: initialBoardState,
    opponentBoard: initialBoardState,
    currentRound: 1,
    playerScore: 0,
    opponentScore: 0,
    currentTurn: Math.random() < 0.5 ? 'player' : 'opponent',
    gamePhase: 'setup',
    activeWeatherEffects: new Set()
  });

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDecoyActive, setIsDecoyActive] = useState(false);
  const [cardsSelector, setCardsSelector] = useState({
    title: '',
    show: false
  });

  const handleDiscardPile = () => {
    setCardsSelector({
      title: "discard-view",
      show: true
    });
  }

  const handleRoundEnd = () => {
    setGameState(prev => {
      // Prevent multiple executions in the same round
      if (prev.gamePhase !== 'roundEnd') return prev;

      const playerScore = calculateTotalScore(prev.playerBoard, prev.activeWeatherEffects);
      const opponentScore = calculateTotalScore(prev.opponentBoard, prev.activeWeatherEffects);

      // Determine who loses life tokens
      let newPlayerLives = prev.player.lives;
      let newOpponentLives = prev.opponent.lives;
      let newPlayerGameScore = prev.player.gameScore;
      let newOpponentGameScore = prev.opponent.gameScore;

      if (playerScore > opponentScore) {
        newOpponentLives--;
      } else if (opponentScore > playerScore) {
        newPlayerLives--;
      } else {
        newPlayerLives--;
        newOpponentLives--;
      }

      // Check for game end
      if (newPlayerLives === 0 || newOpponentLives === 0) {
        let winner: 'player' | 'opponent' | 'draw' = 'draw';
        
        if (newPlayerLives === 0 && newOpponentLives > 0) {
          newOpponentGameScore++;
          winner = 'opponent';
        } else if (newOpponentLives === 0 && newPlayerLives > 0) {
          newPlayerGameScore++;
          winner = 'player';
        }

        // Update local storage with game scores
        const storedScores = JSON.parse(localStorage.getItem('gwentScores') || '{"player": 0, "opponent": 0}');
        const newScores = {
          player: storedScores.player + (winner === 'player' ? 1 : 0),
          opponent: storedScores.opponent + (winner === 'opponent' ? 1 : 0)
        };
        localStorage.setItem('gwentScores', JSON.stringify(newScores));
        // Initialize new game after a short delay
        setTimeout(() => {
          initializeGame(newPlayerGameScore, newOpponentGameScore);
          setCardsSelector({
            title: "redraw",
            show: true
          });
        }, 1000);
      }

      // Collect cards for discard
      const playerDiscardPile = [
        ...prev.player.discard,
        ...prev.playerBoard.close.cards,
        ...prev.playerBoard.ranged.cards,
        ...prev.playerBoard.siege.cards,
      ];

      const opponentDiscardPile = [
        ...prev.opponent.discard,
        ...prev.opponentBoard.close.cards,
        ...prev.opponentBoard.ranged.cards,
        ...prev.opponentBoard.siege.cards,
      ];

      return {
        ...prev,
        gamePhase: 'playing',
        player: {
          ...prev.player,
          passed: false,
          lives: newPlayerLives,
          discard: playerDiscardPile
        },
        opponent: {
          ...prev.opponent,
          passed: false,
          lives: newOpponentLives,
          discard: opponentDiscardPile
        },
        playerBoard: initialBoardState,
        opponentBoard: initialBoardState,
        currentRound: prev.currentRound + 1,
        currentTurn: Math.random() < 0.5 ? 'player' : 'opponent',
        activeWeatherEffects: new Set()
      };
    });
  };

  const { makeOpponentMove, setAiRedrawComplete } = useAI(gameState, handleRoundEnd, setGameState, setSelectedCard);

  const initializeGame = useCallback((playerScore: number, opponentScore: number) => {
    const playerDeckWithLeader = createInitialDeck(Faction.NILFGAARD);
    const opponentDeckWithLeader = createInitialDeck(Faction.NORTHERN_REALMS);

    const playerDeck = shuffle(playerDeckWithLeader.deck);
    const opponentDeck = shuffle(opponentDeckWithLeader.deck);

    const playerHand = playerDeck.splice(0, 10);
    const opponentHand = opponentDeck.splice(0, 10);

    setAiRedrawComplete(false);

    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        deck: playerDeck,
        discard: [],
        hand: playerHand,
        leader: playerDeckWithLeader.leader,
        faction: playerDeckWithLeader.leader.faction,
        gameScore: playerScore,
        passed: false,
        lives: 2
      },
      opponent: {
        ...prev.opponent,
        deck: opponentDeck,
        discard: [],
        hand: opponentHand,
        leader: opponentDeckWithLeader.leader,
        faction: opponentDeckWithLeader.leader.faction,
        gameScore: opponentScore,
        passed: false,
        lives: 2
      },
      currentTurn: Math.random() < 0.5 ? 'player' : 'opponent',
      gamePhase: 'setup',
      activeWeatherEffects: new Set(),
      playerBoard: initialBoardState,
      opponentBoard: initialBoardState,
      currentRound: 1
    }));
  }, [setAiRedrawComplete]);
  
  useEffect(() => {

    const storedScores = JSON.parse(localStorage.getItem('gwentScores') || '{"player": 0, "opponent": 0}');
    const scores = {
      player: storedScores.player,
      opponent: storedScores.opponent
    };

    // Only initialize once at the start
    if (gameState.gamePhase === 'setup' &&
        gameState.player.hand.length === 0 &&
        gameState.opponent.hand.length === 0) {
      initializeGame(Number(scores.player), Number(scores.opponent));
      setCardsSelector({
        title: "redraw",
        show: true
      });
    }
  }, [gameState.gamePhase, gameState.opponent.hand.length, gameState.player.hand.length, initializeGame]);

  const isAIMoving = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
      const shouldMakeMove = 
      gameState.currentTurn === 'opponent' &&
      gameState.gamePhase === 'playing' &&
      !gameState.opponent.passed;

    if (shouldMakeMove) {
      if (!gameState.player.passed && isAIMoving.current) {
        return;
      }

      isAIMoving.current = true;
      timeoutId = setTimeout(() => {
        makeOpponentMove();
        isAIMoving.current = false;
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [gameState, makeOpponentMove]);

  


  const handleCardClick = useCallback((card: Card) => {
    if (gameState.currentTurn !== 'player' || gameState.player.passed) {
      return;
    }
  
    // Verify card is in player's hand before any selection
    const cardInHand = gameState.player.hand.find(c => c.id === card.id);
    if (!cardInHand) {
      return;
    }
  
    // If clicking the same card, deselect it
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
      setIsDecoyActive(false);
      return;
    }
  
    // Handle decoy selection
    if (card.type === CardType.SPECIAL) {
      setIsDecoyActive(false);
  
      switch (card.ability) {
        case (CardAbility.DECOY):
          setSelectedCard(card);
          setIsDecoyActive(true);
          return;
        case (CardAbility.COMMANDERS_HORN):
        case (CardAbility.FROST):
        case (CardAbility.FOG):
        case (CardAbility.RAIN):
        case (CardAbility.CLEAR_WEATHER):
        case (CardAbility.SCORCH):
          setSelectedCard(card);
          return;
      }
    }

    // Handle medic ability
    if ((card.type === CardType.UNIT || card.type === CardType.HERO) &&
    card.ability === CardAbility.MEDIC &&
    gameState.player.discard.length > 0) {
      const validTargets = gameState.player.discard.filter(c => c.type === CardType.UNIT && c.ability !== CardAbility.DECOY);
      if (validTargets.length > 0) {
        setSelectedCard(card);
        setCardsSelector({
          title: 'medic',
          show: true
        });
        return;
      }
    }

    // Handle unit/hero selection
    if (card.type === CardType.UNIT || card.type === CardType.HERO) {
      setSelectedCard(card);
      setIsDecoyActive(false);
    }
  }, [gameState.currentTurn, gameState.player.discard, gameState.player.hand, gameState.player.passed, selectedCard?.id]);

  const handleMedicChain = async (
    gameState: GameState,
    medicCard: Card,
    selectedTarget: UnitCard,
    isPlayer: boolean,
    onStateUpdate: (state: GameState) => void,
    onShowSelector: (show: boolean, title: string) => void,
    onSelectCard: (card: Card | null) => void
  ): Promise<GameState> => {
    // Remove medic card from hand and target from discard
    const playerKey = isPlayer ? 'player' : 'opponent';
    const newDiscard = gameState[playerKey].discard.filter(c => c.id !== selectedTarget.id);
  
    // Create initial state with medic card removed and target removed from discard
    let updatedState = {
      ...gameState,
      [playerKey]: {
        ...gameState[playerKey],
        discard: newDiscard
      }
    };
  
    // Play only the medic card
    updatedState = playCardHelper({
      gameState: updatedState,
      card: medicCard,
      row: (medicCard as UnitCard).row,
      isPlayer
    });
  
    // Now handle the revived card
    if (canTriggerMedic(selectedTarget)) {
      // Set the card as selected so it can be played normally through the game flow
      onSelectCard(selectedTarget);
      // Add it to hand temporarily so it can be played
      updatedState = {
        ...updatedState,
        [playerKey]: {
          ...updatedState[playerKey],
          hand: [...updatedState[playerKey].hand, selectedTarget]
        }
      };
      onShowSelector(true, 'medic');
    } else {
      // For non-medic cards, play them directly
      updatedState = playCardHelper({
        gameState: updatedState,
        card: selectedTarget,
        row: selectedTarget.row,
        isPlayer
      });
      onSelectCard(null);
      onShowSelector(false, '');
    }
  
    onStateUpdate(updatedState);
    return updatedState;
  };

// Updated version of handleMedicCardSelect for GameManager
  const handleMedicCardSelect = async (selectedCards: Card[]) => {
    if (!selectedCard || selectedCards.length !== 1) return;

    const medicCard = selectedCard;
    const reviveCard = selectedCards[0] as UnitCard;

    await handleMedicChain(
      gameState,
      medicCard,
      reviveCard,
      true,
      (newState: GameState) => {
        setGameState(newState);
      },
      (show: boolean, title: string) => {
        setCardsSelector({ show, title });
      },
      (card: Card | null) => {
        setSelectedCard(card);
        if (!card) {
          // If no card is selected, set game turn
          setGameState(prev => ({
            ...prev,
            currentTurn: prev.opponent.passed ? 'player' : 'opponent'
          }));
        }
      }
    );
  };

  const isValidDecoyTarget = (card: Card): boolean => {
    return card.type === CardType.UNIT && card.ability !== CardAbility.DECOY;
  };

  const handleBoardUnitClick = (card: UnitCard) => {
    if (!isDecoyActive || !selectedCard || !isValidDecoyTarget(card)) return;

    const newState = handleDecoyAction(gameState, selectedCard, card, true);
    setGameState(newState);
    setSelectedCard(null);
    setIsDecoyActive(false);
  };

  const handleRowClick = (row: RowPosition) => {
    if (!selectedCard || gameState.currentTurn !== 'player') {
      return;
    }

    if (selectedCard.type === CardType.SPECIAL && selectedCard.ability === CardAbility.DECOY) {
      return;
    }

    if (selectedCard.type === CardType.UNIT || selectedCard.type === CardType.HERO) {
      const unitCard = selectedCard as UnitCard;

      if (unitCard.row === row || unitCard.availableRows?.includes(row)) {
        if (unitCard.ability === CardAbility.SPY) {
          playSpyCard(unitCard, row);
        } else {
          playCard(unitCard, row);
        }
      }
    }

    if (selectedCard.type === CardType.SPECIAL) {
      const specialCard = selectedCard as SpecialCard;

      switch (selectedCard.ability) {
        case CardAbility.COMMANDERS_HORN:
          playHornCard(specialCard, row);
          break;
        case CardAbility.FROST:
        case CardAbility.FOG:
        case CardAbility.RAIN:
          if (canPlayWeatherInRow(specialCard.ability, row)) {
            playWeatherCard(specialCard);
          }
          break;
        case CardAbility.SCORCH:
          playScorchCard(specialCard);
          break;
      }
    }
  };

  const handleWeatherRowClick = () => {
    if (!selectedCard || selectedCard.type !== CardType.SPECIAL) return;

    const ability = selectedCard.ability;
    if (ability === CardAbility.FROST ||
        ability === CardAbility.FOG ||
        ability === CardAbility.RAIN ||
        ability === CardAbility.CLEAR_WEATHER) {
      playWeatherCard(selectedCard);
    }

  };

  const playWeatherCard = (card: SpecialCard) => {
    setSelectedCard(null);
    setIsDecoyActive(false);

    const newState = playCardHelper({
      gameState,
      card,
      isPlayer: true
    });

    setGameState(newState);
  };

  const playHornCard = (card: SpecialCard, row: RowPosition) => {
    setSelectedCard(null);
    setIsDecoyActive(false);

    const newState = playCardHelper({
      gameState,
      card,
      row,
      isPlayer: true
    });
    setGameState(newState);
  };

  const playScorchCard = (card: SpecialCard) => {
    setSelectedCard(null);
    setIsDecoyActive(false);

    const newState = playCardHelper({
      gameState,
      card,
      isPlayer: true
    });
    setGameState(newState);
  };

  const playSpyCard = (card: UnitCard, row: RowPosition) => {
    setSelectedCard(null);
    setIsDecoyActive(false);

    const newState = playCardHelper({
      gameState,
      card,
      row,
      isPlayer: true
    });
    setGameState(newState);
  };

  const playCard = (card: UnitCard, row: RowPosition) => {
    setSelectedCard(null);
    setIsDecoyActive(false);

    const newState = playCardHelper({
      gameState,
      card,
      row,
      isPlayer: true
    });
    setGameState(newState);
  };

  const handlePass = () => {
    if (gameState.currentTurn !== 'player' || gameState.player.passed) {
      return;
    }

    setGameState((prev: GameState) => {
      const newState: GameState = {
        ...prev,
        player: {
          ...prev.player,
          passed: true
        },
        currentTurn: 'opponent'
      };

      // Only trigger round end if opponent has already passed
      if (prev.opponent.passed) {
        newState.gamePhase = 'roundEnd';
        setTimeout(() => handleRoundEnd(), 500);
      }

      return newState;
    });
  };

  const handleRedraw = (selectedCards: Card[]) => {

    setGameState(prev => {
        const newHand = prev.player.hand.filter(
            card => !selectedCards.find(sc => sc.id === card.id)
        );
        const newDeck = [...prev.player.deck, ...selectedCards];
        const shuffledDeck = shuffle(newDeck);
        const drawnCards = shuffledDeck.slice(0, selectedCards.length);
        const remainingDeck = shuffledDeck.slice(selectedCards.length);

        return {
            ...prev,
            player: {
                ...prev.player,
                hand: [...newHand, ...drawnCards],
                deck: remainingDeck
            }
        };
    });
  };

  const handleLeaderAbility = () => {
    if (gameState.player.leader?.ability === LeaderAbility.DRAW_OPPONENT_DISCARD) {
      setCardsSelector({
        title: 'draw_opponent_discard',
        show: true
      });
    }
  };

  return (
    <React.Fragment>
      <DisclaimerModal />
      <GameBoard
        gameState={gameState}
        setGameState={setGameState}
        cardsSelector={cardsSelector}
        setCardsSelector={setCardsSelector}
        onCardClick={handleCardClick}
        onRowClick={handleRowClick}
        onWeatherRowClick={handleWeatherRowClick}
        onBoardUnitClick={handleBoardUnitClick}
        onPass={handlePass}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        isDecoyActive={isDecoyActive}
        handleDiscardPile={handleDiscardPile}
        onRedraw={handleRedraw}
        onMedicSelect={handleMedicCardSelect}
        onLeaderAbility={handleLeaderAbility}

      />
    </React.Fragment>


  );
};

export default GameManager;

