function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

function updateTrumpDisplay() {
  document.getElementById("trumpDisplay").innerText = trumpSuit
    ? "Trump: " + trumpSuit
    : "Trump: Not selected";
}

function updateScores() {
  document.getElementById("teamA").innerText = teamATricks;
  document.getElementById("teamB").innerText = teamBTricks;
  document.getElementById("teamAHands").innerText = teamAHands;
  document.getElementById("teamBHands").innerText = teamBHands;
}

function updateCurrentTurn() {
  const turnElement = document.getElementById("currentTurn");

  if (gamePhase === "handOver") {
    turnElement.innerText = "Hand Over";
  } else if (gamePhase === "selectTrump" || gamePhase === "dealing") {
    turnElement.innerText = "Hakim: " + players[hakimIndex].name;
  } else {
    turnElement.innerText = "Current Turn: " + players[currentPlayerIndex].name;
  }

  document.getElementById("youLabel").classList.toggle("active-player", currentPlayerIndex === 0);
  document.getElementById("leftLabel").classList.toggle("active-player", currentPlayerIndex === 1);
  document.getElementById("partnerLabel").classList.toggle("active-player", currentPlayerIndex === 2);
  document.getElementById("rightLabel").classList.toggle("active-player", currentPlayerIndex === 3);
}

function updateButtons() {
  document.getElementById("newHandBtn").disabled = gamePhase !== "handOver";
  document.getElementById("startBtn").disabled = gamePhase === "dealing";
}

function updateKotDisplay(message) {
  document.getElementById("kotDisplay").innerText = message;
}

function flashDeck() {
  const deck = document.querySelector(".deck-card");
  if (!deck) return;

  deck.classList.remove("deal-flash");
  void deck.offsetWidth;
  deck.classList.add("deal-flash");
}

function showTrumpButtons() {
  document.getElementById("trumpButtons").innerHTML = "";
}

function showTrumpConfirmation(suit) {
  document.getElementById("trumpButtons").innerHTML = `
    <h3>Choose ${suit} as Hokm?</h3>
    <button onclick="confirmTrumpSelection()">Confirm</button>
    <button onclick="cancelTrumpSelection()">Choose Another</button>
  `;
}

function clearTrumpButtons() {
  document.getElementById("trumpButtons").innerHTML = "";
}

function renderAllHands() {
  renderPlayerHand();
  renderCardBacks("leftCards", players[1].hand.length);
  renderCardBacks("partnerCards", players[2].hand.length);
  renderCardBacks("rightCards", players[3].hand.length);
}

function renderPlayerHand() {
  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";

  players[0].hand.forEach((card, index) => {
    const img = document.createElement("img");
    img.className = "real-card";
    img.src = card.image || getCardImagePath(card);
    img.alt = card.name;

    if (gamePhase === "selectTrump" && index === pendingTrumpCardIndex) {
      img.classList.add("selected-trump");
    }

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
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.className = "card-back-img";
    img.src = "assets/cards/BACK.svg";
    img.alt = "Card back";
    container.appendChild(img);
  }
}

function renderTableCards() {
  const playedSlots = {
    0: document.getElementById("youPlayed"),
    1: document.getElementById("leftPlayed"),
    2: document.getElementById("partnerPlayed"),
    3: document.getElementById("rightPlayed")
  };

  Object.values(playedSlots).forEach(slot => {
    slot.innerHTML = "";
  });

  const centerPile = document.getElementById("centerTrickPile");
  if (centerPile) {
    centerPile.innerHTML = currentTrick.length === 0 ? "<span>Court Peace</span>" : "";
  }

  currentTrick.forEach(play => {
    const frontCard = document.createElement("img");
    frontCard.className = "real-card";
    frontCard.src = play.card.image || getCardImagePath(play.card);
    frontCard.alt = play.card.name;

    if (play.playerIndex === winningCardPlayerIndex) {
      frontCard.classList.add("winning-card");
    }

    playedSlots[play.playerIndex].appendChild(frontCard);

    if (centerPile) {
      const centerCard = document.createElement("img");
      centerCard.className = "real-card";
      centerCard.src = play.card.image || getCardImagePath(play.card);
      centerCard.alt = play.card.name;

      if (play.playerIndex === winningCardPlayerIndex) {
        centerCard.classList.add("winning-card");
      }

      centerPile.appendChild(centerCard);
    }
  });
}

function renderHistory() {
  const history = document.getElementById("historyList");
  if (!history) return;

  if (trickHistory.length === 0) {
    history.innerText = "No tricks yet.";
    return;
  }

  history.innerHTML = "";

  trickHistory.slice().reverse().forEach((trick, index) => {
    const div = document.createElement("div");
    div.className = "history-item";
    const cards = trick.cards.map(item => item.player + ": " + item.card).join(" | ");
    div.innerText = "Trick " + (trickHistory.length - index) + " — Winner: " + trick.winner + " — " + cards;
    history.appendChild(div);
  });
}
