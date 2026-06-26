function el(id) {
  return document.getElementById(id);
}

function updateAllUI() {
  updateTrumpDisplay();
  updateScores();
  updatePeopleLabels();
  updateTrickInfo();
  updateCurrentTurn();
  updateButtons();
  renderTableCards();
  renderAllHands();
  renderHistory();
  renderTeamPiles();
}

function updateStatus(message) {
  el("status").innerText = message;
}

function suitName(suit) {
  return ({ "♠": "SPADES", "♥": "HEARTS", "♦": "DIAMONDS", "♣": "CLUBS" }[suit] || "Not selected");
}

function updateTrumpDisplay() {
  const display = trumpSuit ? trumpSuit + " " + suitName(trumpSuit) : "Not selected";
  el("trumpDisplay").innerText = display;
  el("sideTrump").innerText = trumpSuit ? display : "HOKM: Not selected";
}

function updateScores() {
  el("teamA").innerText = teamATricks;
  el("teamB").innerText = teamBTricks;
  el("teamAHands").innerText = teamAHands;
  el("teamBHands").innerText = teamBHands;
  el("yourPileTotal").innerText = teamATricks;
  el("opponentPileTotal").innerText = teamBTricks;
}

function updatePeopleLabels() {
  el("hakimName").innerText = players[hakimIndex].name;
  el("dealerName").innerText = players[dealerIndex].name;
  el("centerHakim").innerText = players[hakimIndex].name;
  el("centerDealer").innerText = players[dealerIndex].name;
}

function updateTrickInfo() {
  el("trickNumber").innerText = Math.min(trickHistory.length + 1, 13);
}

function labelForPlayer(index) {
  let label = players[index].name;
  if (index === hakimIndex) label += " 👑";
  if (index === dealerIndex) label += " D";
  return label;
}

function updateCurrentTurn() {
  el("youLabel").classList.toggle("active-player", currentPlayerIndex === 0);
  el("leftLabel").classList.toggle("active-player", currentPlayerIndex === 1);
  el("partnerLabel").classList.toggle("active-player", currentPlayerIndex === 2);
  el("rightLabel").classList.toggle("active-player", currentPlayerIndex === 3);

  el("youLabel").innerText = labelForPlayer(0);
  el("leftLabel").innerText = labelForPlayer(1);
  el("partnerLabel").innerText = labelForPlayer(2);
  el("rightLabel").innerText = labelForPlayer(3);
}

function updateButtons() {
  el("newHandBtn").disabled = gamePhase !== "handOver";
  el("startBtn").disabled = gamePhase === "dealing";
}

function updateKotDisplay(message) {
  el("kotDisplay").innerText = message || "";
}

function showTrumpButtons() {}

function clearTrumpButtons() {
  el("trumpButtons").innerHTML = "";
}

function renderAllHands() {
  renderPlayerHand();
  renderCardBacks("leftCards", players[1].hand.length);
  renderCardBacks("partnerCards", players[2].hand.length);
  renderCardBacks("rightCards", players[3].hand.length);
}

function renderPlayerHand() {
  const handDiv = el("hand");
  handDiv.innerHTML = "";

  players[0].hand.forEach((card, index) => {
    const img = document.createElement("img");
    img.className = "card";
    img.src = card.image;
    img.alt = card.name;

    if (gamePhase === "selectTrump" && hakimIndex === 0) {
      img.classList.add("playable");
      img.onclick = () => selectTrumpFromCard(index);
    } else if (gamePhase === "playing" && currentPlayerIndex === 0 && isLegalPlay(players[0], card)) {
      img.classList.add("playable");
      img.onclick = () => playHumanCard(index);
    } else if (gamePhase === "playing" && currentPlayerIndex === 0) {
      img.classList.add("disabled");
    }

    handDiv.appendChild(img);
  });
}

function renderCardBacks(elementId, count) {
  const container = el(elementId);
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.className = "back";
    img.src = "assets/cards/BACK.svg";
    img.alt = "Card back";
    container.appendChild(img);
  }
}

function renderTableCards() {
  const playedSlots = {
    0: el("youPlayed"),
    1: el("leftPlayed"),
    2: el("partnerPlayed"),
    3: el("rightPlayed")
  };

  Object.values(playedSlots).forEach(slot => {
    slot.innerHTML = "";
  });

  currentTrick.forEach(play => {
    const img = document.createElement("img");
    img.className = "card";
    img.src = play.card.image;
    img.alt = play.card.name;

    if (play.playerIndex === winningCardPlayerIndex) {
      img.classList.add("winning-card");
    }

    playedSlots[play.playerIndex].appendChild(img);
  });
}

function renderTeamPiles() {
  renderPile("yourTeamPile", teamAPiles);
  renderPile("opponentPile", teamBPiles);
}

function renderPile(elementId, piles) {
  const container = el(elementId);
  container.innerHTML = "";

  piles.forEach((pile, index) => {
    const pileDiv = document.createElement("div");
    pileDiv.className = "trick-pile";
    pileDiv.title = "Trick " + (index + 1);

    for (let i = 0; i < 4; i++) {
      const img = document.createElement("img");
      img.src = "assets/cards/BACK.svg";
      img.alt = "Face-down won trick card";
      pileDiv.appendChild(img);
    }

    const number = document.createElement("div");
    number.className = "trick-number";
    number.innerText = index + 1;
    pileDiv.appendChild(number);

    container.appendChild(pileDiv);
  });
}

function renderHistory() {
  const history = el("historyList");

  if (trickHistory.length === 0) {
    history.innerText = "No tricks yet.";
    return;
  }

  history.innerHTML = "";

  trickHistory.slice().reverse().forEach((trick, index) => {
    const div = document.createElement("div");
    div.className = "history-item";

    const cards = trick.cards
      .map(item => item.player + ": " + item.card)
      .join(" | ");

    div.innerText = "Trick " + (trickHistory.length - index) + " — Winner: " + trick.winner + " — " + cards;
    history.appendChild(div);
  });
}
