import { Card, GameState } from '@/types/card';
import { useState } from 'react'

interface GameCardsSelectorProps {
    gameState: GameState;
    title: string;
    setCardsSelector: (cardsSelector: { title: string; show: boolean }) => void;
    onRedraw: (selectedCards: Card[]) => void;
    setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}
const GameCardsSelector = ({gameState, title, setCardsSelector, onRedraw, setGameState}: GameCardsSelectorProps) => {
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [redrawnCount, setRedrawnCount] = useState<number>(0);

    const getTitle = (title: string) => {
        switch (title) {
            case 'redraw':
                return `Choose a card to redraw. ${redrawnCount}/2`;
            case 'discard-view':
                return `Discard Pile`;
            default:
                return title;
        }
    }

    const handleCardSelect = (card: Card) => {
        if (selectedCards.find(c => c.id === card.id)) {
            setSelectedCards(selectedCards.filter(c => c.id !== card.id));
        } else if (selectedCards.length < 1) {
            setSelectedCards([...selectedCards, card]);
        }
    };

    const handleRedraw = () => {
        if (selectedCards.length > 0) {
            const newCount = redrawnCount + 1;

            onRedraw(selectedCards);

            Promise.resolve().then(() => {
                setSelectedCards([]);
                setRedrawnCount(newCount);

                if (newCount >= 2) {
                    setGameState((prev: GameState) => ({
                        ...prev,
                        gamePhase: 'playing'
                    }));
                    setCardsSelector({ title: '', show: false });
                }
            });
        }
    };

    return (
        <div className='game-cards-selector-container'>
            <div className='card-selector-content'>
                <div className='card-selector-title'>{getTitle(title)}</div>
                <div className='card-selector-container'>

                    {title === 'redraw' && gameState.player.hand.map((card: Card) => (
                        <div
                            key={card.id}
                            className={`card-selector-image ${selectedCards.find(c => c.id === card.id) ? 'selected' : ''}`}
                            onClick={() => handleCardSelect(card)}
                        >
                            <img src={card.imageUrl} alt={card.name} />
                        </div>
                    ))}

                    {title === 'discard-view' && (
                        gameState.player.discard.length === 0 ? (
                            <div style={{width: '100%', height: '100%', textAlign: 'center', padding: '10px'}}>discard pile is currently empty.</div>
                        ) : (
                            gameState.player.discard.map((card: Card) => (
                                <div
                                    key={card.id}
                                    className={`card-selector-image ${selectedCards.find(c => c.id === card.id) ? 'selected' : ''}`}
                                    onClick={() => handleCardSelect(card)}
                                >
                                    <img src={card.imageUrl} alt={card.name} />
                                </div>
                            ))
                        )
                    )}
                </div>
                <div className='card-selector-button-container'>
                    {title === 'redraw' && (
                        <button
                            className='card-selector-button'
                            disabled={selectedCards.length === 0}
                            onClick={handleRedraw}
                        >
                            Redraw
                        </button>
                    )}
                    <button
                        className='card-selector-button'
                        onClick={() => {
                            setGameState({
                                ...gameState,
                                gamePhase: 'playing'
                            });
                            setCardsSelector({ title: '', show: false });
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameCardsSelector