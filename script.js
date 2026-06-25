const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

let deck = [];
let playerHand = [];
let trumpSuit = "";

function createDeck() {
  let newDeck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      newDeck.push({
        rank: rank,
        suit: suit,
        name: rank + suit
      });
    }
  }

  return newDeck;
}

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

function startGame() {
  deck = shuffle(createDeck());
  playerHand = [];
  trumpSuit = "";

  for (let i = 0; i < 5; i++) {
    playerHand.push(deck.pop());
  }

  document.getElementById("status").innerText = "Hakim received 5 cards. Select trump.";
  document.getElementById("trumpDisplay").innerText = "Trump: Not selected";

  showHand();
  showTrumpButtons();
}

function showHand() {
  const handDiv = document.getElementById("hand");
  handDiv.innerHTML = "";

  playerHand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    if (card.suit === "♥" || card.suit === "♦") {
      cardDiv.classList.add("red");
    }

    cardDiv.innerText = card.name;
    handDiv.appendChild(cardDiv);
  });
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

function selectTrump(suit) {
  trumpSuit = suit;

  while (playerHand.length < 13) {
    playerHand.push(deck.pop());
  }

  document.getElementById("status").innerText = "Trump selected. Full hand dealt.";
  document.getElementById("trumpDisplay").innerText = "Trump: " + trumpSuit;
  document.getElementById("trumpButtons").innerHTML = "";

  showHand();
}