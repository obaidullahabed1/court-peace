const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

const rankPower = {
  "A": 14, "K": 13, "Q": 12, "J": 11, "10": 10,
  "9": 9, "8": 8, "7": 7, "6": 6, "5": 5,
  "4": 4, "3": 3, "2": 2
};

function getCardFileName(card) {
  const suitCode = { "♠": "S", "♥": "H", "♦": "D", "♣": "C" };
  return card.rank + suitCode[card.suit] + ".svg";
}

function getCardImagePath(card) {
  return "assets/cards/" + getCardFileName(card);
}

function createDeck() {
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        rank,
        suit,
        name: rank + suit,
        image: getCardImagePath({ rank, suit })
      });
    }
  }

  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
