function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

function updateTrumpDisplay() {
  const text = trumpSuit ? "Trump: " + trumpSuit : "Trump: Not selected";
  document.getElementById("trumpDisplay").innerText = text;
}

function updateScores() {
  document.getElementById("teamA").innerText = teamATricks;
  document.getElementById("teamB").innerText = teamBTricks;
}

function showTrumpButtons() {
  document.getElementById("trumpButtons").innerHTML = `
    <h3>Select Hokm / Trump</h3>
    <button onclick="selectTrump('♠')">♠ Spades</button>
    <button onclick="selectTrump('♥')">♥ Hearts</button>
    <button onclick="selectTrump('♦')">♦ Diamonds</button>
    <button onclick="selectTrump('♣')">♣ Clubs</button>
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

  players[0].hand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    if (card.suit === "♥" || card.suit === "♦") {
      cardDiv.classList.add("red");
    }

    cardDiv.innerText = card.name;
    handDiv.appendChild(cardDiv);
  });
}

function renderCardBacks(elementId, count) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    container.appendChild(cardBack);
  }
}