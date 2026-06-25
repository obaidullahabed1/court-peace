let gameDeck = [];
let trumpSuit = "";
let teamATricks = 0;
let teamBTricks = 0;
let hakimIndex = 0;
let currentPlayerIndex = 0;
let currentTrick = [];
let leadSuit = null;
let handIsOver = false;
let gamePhase = "waiting";

function startGame() {
  gameDeck = shuffleDeck(createDeck());
  trumpSuit = "";
  teamATricks = 0;
  teamBTricks = 0;
  currentPlayerIndex = hakimIndex;
  currentTrick = [];
  leadSuit = null;
  handIsOver = false;
  gamePhase = "selectTrump";

  resetPlayers();

  for (let i = 0; i < 5; i++) {
    players[hakimIndex].hand.push(gameDeck.pop());
  }

  updateStatus("Hakim received 5 cards. Select trump.");
  updateTrumpDisplay();
  updateScores();
  updateCurrentTurn();
  renderTableCards();
  renderAllHands();
  showTrumpButtons();
}

function selectTrump(suit) {
  if (gamePhase !== "selectTrump") return;
  trumpSuit = suit;

  while (players.some(player => player.hand.length < 13)) {
    for (const player of players) {
      if (player.hand.length < 13) {
        player.hand.push(gameDeck.pop());
      }
    }
  }

  players.forEach(player => sortPlayerHand(player.hand));
  gamePhase = "playing";
  currentPlayerIndex = hakimIndex;

  updateStatus("Trump selected. You lead first. Click a card to play.");
  updateTrumpDisplay();
  updateScores();
  updateCurrentTurn();
  clearTrumpButtons();
  renderAllHands();

  if (currentPlayerIndex !== 0) {
    setTimeout(playAiTurn, 800);
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

  currentTrick.push({ playerIndex, card });
  updateStatus(players[playerIndex].name + " played " + card.name);
  renderAllHands();
  renderTableCards();
}

function continueAfterPlay() {
  if (currentTrick.length === 4) {
    setTimeout(finishTrick, 900);
    return;
  }

  currentPlayerIndex = (currentPlayerIndex + 1) % 4;
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
  return !(hasLeadSuit && card.suit !== leadSuit);
}

function chooseAiCardIndex(player) {
  const legalCards = player.hand
    .map((card, index) => ({ card, index }))
    .filter(item => isLegalPlay(player, item.card));

  legalCards.sort((a, b) => rankPower[a.card.rank] - rankPower[b.card.rank]);
  return legalCards[0].index;
}

function endHand() {
  handIsOver = true;
  gamePhase = "handOver";

  const winnerText = teamATricks >= 7
    ? "Your team wins the hand!"
    : "Opponent team wins the hand!";

  updateStatus(winnerText + " Click Start Game for a new hand.");
  updateCurrentTurn();
}

function sortPlayerHand(hand) {
  const suitOrder = { "♠": 1, "♥": 2, "♦": 3, "♣": 4 };
  const rankOrder = {
    "A": 1, "K": 2, "Q": 3, "J": 4, "10": 5,
    "9": 6, "8": 7, "7": 8, "6": 9, "5": 10,
    "4": 11, "3": 12, "2": 13
  };

  hand.sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return rankOrder[a.rank] - rankOrder[b.rank];
  });
}
