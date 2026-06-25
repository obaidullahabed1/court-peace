let gameDeck = [];
let trumpSuit = "";
let teamATricks = 0;
let teamBTricks = 0;
let teamAHands = 0;
let teamBHands = 0;

let hakimIndex = 0;
let currentPlayerIndex = 0;
let currentTrick = [];
let leadSuit = null;
let handIsOver = false;
let gamePhase = "waiting";
let lastHandWinnerTeam = null;

let pendingTrumpCardIndex = null;
let pendingTrumpSuit = "";

// Counter-clockwise order:
// 0 = You
// 3 = Right Opponent
// 2 = Partner
// 1 = Left Opponent
const playOrder = [0, 3, 2, 1];

function nextPlayer(playerIndex) {
  const currentPosition = playOrder.indexOf(playerIndex);
  return playOrder[(currentPosition + 1) % playOrder.length];
}

function startGame() {
  teamAHands = 0;
  teamBHands = 0;
  hakimIndex = 0;
  startNewHand();
}

function startNextHand() {
  if (gamePhase !== "handOver") return;
  startNewHand();
}

function startNewHand() {
  gameDeck = shuffleDeck(createDeck());
  trumpSuit = "";
  teamATricks = 0;
  teamBTricks = 0;
  currentPlayerIndex = hakimIndex;
  currentTrick = [];
  leadSuit = null;
  handIsOver = false;
  gamePhase = "selectTrump";
  lastHandWinnerTeam = null;
  pendingTrumpCardIndex = null;
  pendingTrumpSuit = "";

  resetPlayers();

  for (let i = 0; i < 5; i++) {
    players[hakimIndex].hand.push(gameDeck.pop());
  }

  clearTrumpButtons();
  updateTrumpDisplay();
  updateScores();
  updateCurrentTurn();
  updateButtons();
  updateKotDisplay("");
  renderTableCards();
  renderAllHands();

  if (hakimIndex === 0) {
    updateStatus("You are Hakim. Click one of your 5 cards to choose trump.");
  } else {
    updateStatus(players[hakimIndex].name + " is Hakim. AI is choosing trump.");
    setTimeout(autoSelectTrumpForAI, 900);
  }
}

function selectTrumpFromCard(cardIndex) {
  if (gamePhase !== "selectTrump") return;
  if (hakimIndex !== 0) return;

  const selectedCard = players[0].hand[cardIndex];

  pendingTrumpCardIndex = cardIndex;
  pendingTrumpSuit = selectedCard.suit;

  updateStatus("Confirm " + pendingTrumpSuit + " as Hokm?");
  renderAllHands();
  showTrumpConfirmation(pendingTrumpSuit);
}

function confirmTrumpSelection() {
  if (!pendingTrumpSuit) return;

  const confirmedSuit = pendingTrumpSuit;

  pendingTrumpCardIndex = null;
  pendingTrumpSuit = "";

  selectTrump(confirmedSuit);
}

function cancelTrumpSelection() {
  pendingTrumpCardIndex = null;
  pendingTrumpSuit = "";

  updateStatus("Choose another card for Hokm.");
  clearTrumpButtons();
  renderAllHands();
}

function autoSelectTrumpForAI() {
  if (gamePhase !== "selectTrump") return;

  const hakim = players[hakimIndex];
  const suitCounts = { "♠": 0, "♥": 0, "♦": 0, "♣": 0 };

  hakim.hand.forEach(card => {
    suitCounts[card.suit]++;
  });

  let bestSuit = "♠";

  for (const suit of suits) {
    if (suitCounts[suit] > suitCounts[bestSuit]) {
      bestSuit = suit;
    }
  }

  selectTrump(bestSuit);
}

function selectTrump(suit) {
  if (gamePhase !== "selectTrump") return;

  trumpSuit = suit;

  while (players.some(player => player.hand.length < 13)) {
    for (const playerIndex of playOrder) {
      const player = players[playerIndex];

      if (player.hand.length < 13) {
        player.hand.push(gameDeck.pop());
      }
    }
  }

  players.forEach(player => sortPlayerHand(player.hand));

  gamePhase = "playing";
  currentPlayerIndex = hakimIndex;

  updateStatus("Trump selected: " + trumpSuit + ". " + players[currentPlayerIndex].name + " leads.");
  updateTrumpDisplay();
  updateScores();
  updateCurrentTurn();
  updateButtons();
  clearTrumpButtons();
  renderAllHands();

  if (currentPlayerIndex !== 0) {
    setTimeout(playAiTurn, 900);
  }
}

function playHumanCard(cardIndex) {
  if (gamePhase !== "playing" || handIsOver) return;
  if (currentPlayerIndex !== 0) return;

  const card = players[0].hand[cardIndex];

  if (!isLegalPlay(players[0], card)) {
    updateStatus("You must follow suit if you have it.");
    return;
  }

  playCard(0, cardIndex);
  continueAfterPlay();
}

function playAiTurn() {
  if (gamePhase !== "playing" || handIsOver) return;
  if (currentPlayerIndex === 0) return;

  const player = players[currentPlayerIndex];
  const cardIndex = chooseAiCardIndex(player);

  playCard(currentPlayerIndex, cardIndex);
  continueAfterPlay();
}

function playCard(playerIndex, cardIndex) {
  const player = players[playerIndex];
  const card = player.hand.splice(cardIndex, 1)[0];

  if (currentTrick.length === 0) {
    leadSuit = card.suit;
  }

  currentTrick.push({
    playerIndex,
    card
  });

  updateStatus(players[playerIndex].name + " played " + card.name);
  renderAllHands();
  renderTableCards();
}

function continueAfterPlay() {
  if (currentTrick.length === 4) {
    setTimeout(finishTrick, 900);
    return;
  }

  currentPlayerIndex = nextPlayer(currentPlayerIndex);
  updateCurrentTurn();

  if (currentPlayerIndex !== 0) {
    setTimeout(playAiTurn, 900);
  } else {
    updateStatus("Your turn. Play a card.");
    renderAllHands();
  }
}

function finishTrick() {
  const winningPlay = getTrickWinner();
  const winningPlayer = players[winningPlay.playerIndex];

  if (winningPlayer.team === "A") {
    teamATricks++;
  } else {
    teamBTricks++;
  }

  updateScores();
  updateStatus(winningPlayer.name + " won the trick.");

  currentPlayerIndex = winningPlay.playerIndex;
  currentTrick = [];
  leadSuit = null;

  renderTableCards();
  renderAllHands();

  if (teamATricks >= 7 || teamBTricks >= 7) {
    endHand();
    return;
  }

  updateCurrentTurn();

  if (currentPlayerIndex !== 0) {
    setTimeout(playAiTurn, 1200);
  } else {
    setTimeout(() => {
      updateStatus("You won the trick. Lead the next card.");
      renderAllHands();
    }, 600);
  }
}

function getTrickWinner() {
  let winner = currentTrick[0];

  for (const play of currentTrick.slice(1)) {
    if (doesCardBeat(play.card, winner.card)) {
      winner = play;
    }
  }

  return winner;
}

function doesCardBeat(card, currentWinnerCard) {
  if (card.suit === currentWinnerCard.suit) {
    return rankPower[card.rank] > rankPower[currentWinnerCard.rank];
  }

  if (card.suit === trumpSuit && currentWinnerCard.suit !== trumpSuit) {
    return true;
  }

  return false;
}

function isLegalPlay(player, card) {
  if (currentTrick.length === 0) return true;

  const hasLeadSuit = player.hand.some(handCard => handCard.suit === leadSuit);

  if (hasLeadSuit && card.suit !== leadSuit) {
    return false;
  }

  return true;
}

function chooseAiCardIndex(player) {
  const legalCards = player.hand
    .map((card, index) => ({
      card,
      index
    }))
    .filter(item => isLegalPlay(player, item.card));

  legalCards.sort((a, b) => rankPower[a.card.rank] - rankPower[b.card.rank]);

  return legalCards[0].index;
}

function endHand() {
  handIsOver = true;
  gamePhase = "handOver";

  const winningTeam = teamATricks >= 7 ? "A" : "B";
  lastHandWinnerTeam = winningTeam;

  let kot = false;

  if (winningTeam === "A") {
    teamAHands++;
    kot = teamBTricks === 0;
  } else {
    teamBHands++;
    kot = teamATricks === 0;
  }

  if (kot) {
    updateKotDisplay(
      "KOT! " +
      (winningTeam === "A" ? "Your team" : "Opponent team") +
      " won 7 tricks while the other team had 0."
    );
  } else {
    updateKotDisplay("");
  }

  rotateHakimAfterHand(winningTeam);

  updateScores();
  updateStatus(
    (winningTeam === "A" ? "Your team" : "Opponent team") +
    " wins the hand. Click Next Hand."
  );

  updateCurrentTurn();
  updateButtons();
}

function rotateHakimAfterHand(winningTeam) {
  const winningPlayerIndexes = players
    .filter(player => player.team === winningTeam)
    .map(player => player.id);

  if (!winningPlayerIndexes.includes(hakimIndex)) {
    hakimIndex = nextPlayer(hakimIndex);
  }
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
