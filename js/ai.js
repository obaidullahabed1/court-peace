function chooseAiCardIndex(player) {
  const legalCards = player.hand
    .map((card, index) => ({ card, index }))
    .filter(item => isLegalPlay(player, item.card));

  if (legalCards.length === 0) return 0;

  if (currentTrick.length === 0) {
    return chooseLeadCard(player, legalCards);
  }

  const currentWinningPlay = getTrickWinner();
  const currentWinningPlayer = players[currentWinningPlay.playerIndex];

  if (currentWinningPlayer.team === player.team) {
    return chooseLowestCard(legalCards).index;
  }

  const winningOptions = legalCards
    .filter(item => doesCardBeat(item.card, currentWinningPlay.card))
    .sort((a, b) => cardValue(a.card) - cardValue(b.card));

  if (winningOptions.length > 0) return winningOptions[0].index;

  return chooseLowestCard(legalCards).index;
}

function chooseLeadCard(player, legalCards) {
  const nonTrumpCards = legalCards.filter(item => item.card.suit !== trumpSuit);
  const pool = nonTrumpCards.length > 0 ? nonTrumpCards : legalCards;

  pool.sort((a, b) => {
    const suitCountA = countSuitInHand(player.hand, a.card.suit);
    const suitCountB = countSuitInHand(player.hand, b.card.suit);
    if (suitCountA !== suitCountB) return suitCountB - suitCountA;
    return rankPower[a.card.rank] - rankPower[b.card.rank];
  });

  return pool[0].index;
}

function chooseLowestCard(cards) {
  return [...cards].sort((a, b) => cardValue(a.card) - cardValue(b.card))[0];
}

function cardValue(card) {
  return rankPower[card.rank] + (card.suit === trumpSuit ? 20 : 0);
}

function countSuitInHand(hand, suit) {
  return hand.filter(card => card.suit === suit).length;
}
