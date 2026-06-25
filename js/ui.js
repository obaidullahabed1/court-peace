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
  } else if (gamePhase === "selectTrump") {
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
}

function updateKotDisplay(message) {
  document.getElementById("kotDisplay").innerText = message;
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

    if (gamePhase === "playing" && currentPlayerIndex === 0 && isLegalPlay(players[0], card)) {
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
  const table = document.getElementById("tableCards");

  if (currentTrick.length === 0) {
    table.innerHTML = "Playing Area";
    return;
  }

  table.innerHTML = "";

  currentTrick.forEach(play => {
    const slot = document.createElement("div");
    slot.className = "played-slot";

    const label = document.createElement("small");
    label.innerText = players[play.playerIndex].name;

    const img = document.createElement("img");
    img.className = "real-card";
    img.src = play.card.image || getCardImagePath(play.card);
    img.alt = play.card.name;

    slot.appendChild(label);
    slot.appendChild(img);
    table.appendChild(slot);
  });
}
