import React, { useState, useEffect } from 'react';
import { Card, createDeck, canStack, canMoveToFoundation, isRed } from '../utils/cards';

interface DragItem {
  cards: Card[];
  sourceType: 'tableau' | 'waste' | 'foundation';
  sourceIndex: number;
}

const Solitaire: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([]);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = createDeck();
    const newTableau: Card[][] = Array(7).fill([]).map((_, i) => {
      return newDeck.splice(0, i + 1).map((card, cardIndex) => ({
        ...card,
        faceUp: cardIndex === i
      }));
    });
    setDeck(newDeck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setTableau(newTableau);
  };

  const drawCard = () => {
    if (deck.length === 0) {
      setDeck(waste.reverse().map(card => ({ ...card, faceUp: false })));
      setWaste([]);
      return;
    }
    const drawnCards = deck.slice(-1).map(card => ({ ...card, faceUp: true }));
    setWaste([...waste, ...drawnCards]);
    setDeck(deck.slice(0, -1));
  };

  const handleDragStart = (cards: Card[], sourceType: 'tableau' | 'waste' | 'foundation', sourceIndex: number) => {
    setDragItem({ cards, sourceType, sourceIndex });
  };

  const handleDrop = (targetType: 'tableau' | 'foundation', targetIndex: number) => {
    if (!dragItem) return;

    const { cards, sourceType, sourceIndex } = dragItem;
    const firstCard = cards[0];

    if (targetType === 'foundation') {
      const foundation = foundations[targetIndex];
      if (!canMoveToFoundation(firstCard, foundation[foundation.length - 1])) return;

      if (sourceType === 'tableau') {
        const newTableau = [...tableau];
        newTableau[sourceIndex] = newTableau[sourceIndex].slice(0, -1);
        if (newTableau[sourceIndex].length > 0) {
          newTableau[sourceIndex][newTableau[sourceIndex].length - 1].faceUp = true;
        }
        setTableau(newTableau);
      } else if (sourceType === 'waste') {
        setWaste(waste.slice(0, -1));
      }

      const newFoundations = [...foundations];
      newFoundations[targetIndex] = [...foundation, firstCard];
      setFoundations(newFoundations);
    }

    if (targetType === 'tableau') {
      const targetPile = tableau[targetIndex];
      const topCard = targetPile[targetPile.length - 1];
      
      if (targetPile.length === 0 && firstCard.rank === 'K' || 
          (topCard && canStack(firstCard, topCard))) {
        const newTableau = [...tableau];
        
        if (sourceType === 'tableau') {
          newTableau[sourceIndex] = newTableau[sourceIndex].slice(0, -cards.length);
          if (newTableau[sourceIndex].length > 0) {
            newTableau[sourceIndex][newTableau[sourceIndex].length - 1].faceUp = true;
          }
        } else if (sourceType === 'waste') {
          setWaste(waste.slice(0, -1));
        }

        newTableau[targetIndex] = [...targetPile, ...cards];
        setTableau(newTableau);
      }
    }

    setDragItem(null);
  };

  return (
    <div className="solitaire">
      <div className="solitaire-header">
        <div className="stock" onClick={drawCard}>
          {deck.length > 0 ? '🂠' : '⭕'}
        </div>
        <div className="waste">
          {waste.map((card, i) => (
            <div
              key={i}
              className="card"
              draggable={i === waste.length - 1}
              onDragStart={() => handleDragStart([card], 'waste', 0)}
              style={{ color: isRed(card.suit) ? 'red' : 'black' }}
            >
              {card.faceUp ? `${card.rank}${card.suit}` : '🂠'}
            </div>
          ))}
        </div>
        <div className="foundations">
          {foundations.map((foundation, i) => (
            <div
              key={i}
              className="foundation"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('foundation', i)}
            >
              {foundation.length > 0 ? 
                foundation[foundation.length - 1].rank + foundation[foundation.length - 1].suit 
                : '⬚'}
            </div>
          ))}
        </div>
      </div>
      <div className="tableau">
        {tableau.map((pile, pileIndex) => (
          <div
            key={pileIndex}
            className="pile"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('tableau', pileIndex)}
          >
            {pile.map((card, cardIndex) => (
              <div
                key={cardIndex}
                className="card"
                draggable={card.faceUp}
                onDragStart={() => handleDragStart(pile.slice(cardIndex), 'tableau', pileIndex)}
                style={{ 
                  color: isRed(card.suit) ? 'red' : 'black',
                  top: `${cardIndex * 20}px`
                }}
              >
                {card.faceUp ? `${card.rank}${card.suit}` : '🂠'}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="new-game-button" onClick={startNewGame}>New Game</button>
    </div>
  );
};

export default Solitaire; 