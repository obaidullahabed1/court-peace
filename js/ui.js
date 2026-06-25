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
    const img = document.createElement("img");
    img.className = "real-card";
    img.src = createCardSvg(card);
    img.alt = card.name;
    handDiv.appendChild(img);
  });
}

function renderCardBacks(elementId, count) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.className = "card-back-img";
    img.src = createCardBackSvg();
    img.alt = "Card back";
    container.appendChild(img);
  }
}

function createCardSvg(card) {
  const red = card.suit === "♥" || card.suit === "♦";
  const color = red ? "#c1121f" : "#111111";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="230" viewBox="0 0 160 230">
      <rect x="4" y="4" width="152" height="222" rx="16" fill="white" stroke="#dddddd" stroke-width="4"/>
      <text x="18" y="34" font-size="28" font-family="Arial" font-weight="bold" fill="${color}">${card.rank}</text>
      <text x="18" y="62" font-size="28" font-family="Arial" fill="${color}">${card.suit}</text>
      <text x="80" y="135" text-anchor="middle" font-size="76" font-family="Arial" fill="${color}">${card.suit}</text>
      <g transform="rotate(180 80 115)">
        <text x="18" y="34" font-size="28" font-family="Arial" font-weight="bold" fill="${color}">${card.rank}</text>
        <text x="18" y="62" font-size="28" font-family="Arial" fill="${color}">${card.suit}</text>
      </g>
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function createCardBackSvg() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="230" viewBox="0 0 160 230">
      <rect x="4" y="4" width="152" height="222" rx="16" fill="#082567" stroke="white" stroke-width="5"/>
      <rect x="18" y="18" width="124" height="194" rx="10" fill="#123c9c" stroke="#ffffff" stroke-width="3"/>
      <path d="M30 30 L130 200 M50 30 L150 200 M10 30 L110 200" stroke="#dbeafe" stroke-width="5" opacity="0.55"/>
      <circle cx="80" cy="115" r="36" fill="#ffffff" opacity="0.18"/>
      <text x="80" y="128" text-anchor="middle" font-size="42" font-family="Arial" fill="white">CP</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}