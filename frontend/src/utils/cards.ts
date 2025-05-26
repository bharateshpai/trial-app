export type Suit = '♠' | '♣' | '♥' | '♦';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export const suits: Suit[] = ['♠', '♣', '♥', '♦'];
export const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, faceUp: false });
    }
  }
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const isRed = (suit: Suit): boolean => {
  return suit === '♥' || suit === '♦';
};

export const canStack = (top: Card, bottom: Card): boolean => {
  const rankOrder = ranks.indexOf(top.rank);
  const bottomRankOrder = ranks.indexOf(bottom.rank);
  return rankOrder === bottomRankOrder - 1 && isRed(top.suit) !== isRed(bottom.suit);
};

export const canMoveToFoundation = (card: Card, topCard?: Card): boolean => {
  if (!topCard) {
    return card.rank === 'A';
  }
  const rankOrder = ranks.indexOf(card.rank);
  const topRankOrder = ranks.indexOf(topCard.rank);
  return card.suit === topCard.suit && rankOrder === topRankOrder + 1;
}; 