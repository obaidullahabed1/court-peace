let gameDeck = [];
let trumpSuit = "";
let teamATricks = 0;
let teamBTricks = 0;
let hakimIndex = 0;

function startGame() {
  gameDeck = shuffleDeck(createDeck());
  trumpSuit = "";
  teamATricks = 0;
  teamBTricks = 0;

  resetPlayers();

  // Hakim gets only 5 cards first.
  for (let i = 0; i < 5; i++) {
    players[hakimIndex].hand.push(gameDeck.pop());
  }

  updateStatus("Hakim received 5 cards. Select trump.");
  updateTrumpDisplay();
  updateScores();
  renderAllHands();
  showTrumpButtons();
}

function selectTrump(suit) {
  trumpSuit = suit;

  // Finish dealing all players to 13 cards.
  while (players.some(player => player.hand.length < 13)) {
    for (const player of players) {
      if (player.hand.length < 13) {
        player.hand.push(gameDeck.pop());
      }
    }
  }

  sortPlayerHand(players[0].hand);

  updateStatus("Trump selected. Full hand dealt.");
  updateTrumpDisplay();
  updateScores();
  clearTrumpButtons();
  renderAllHands();
}

function sortPlayerHand(hand) {
  const suitOrder = {
    "♠": 1,
    "♥": 2,
    "♦": 3,
    "♣": 4
  };

  const rankOrder = {
    "A": 1,
    "K": 2,
    "Q": 3,
    "J": 4,
    "10": 5,
    "9": 6,
    "8": 7,
    "7": 8,
    "6": 9,
    "5": 10,
    "4": 11,
    "3": 12,
    "2": 13
  };

  hand.sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }

    return rankOrder[a.rank] - rankOrder[b.rank];
  });
}