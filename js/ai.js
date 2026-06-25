function chooseAiCardIndex(player) {
  const legalCards = player.hand
    .map((card, index) => ({ card, index }))
    .filter(item => isLegalPlay(player, item.card));

  if (currentTrick.length === 0) {
    return chooseLeadCard(legalCards);
  }

  const currentWinningPlay = getTrickWinner();
  const currentWinningPlayer = players[currentWinningPlay.playerIndex];

  if (currentWinningPlayer.team === player.team) {
    return chooseLowestCard(legalCards).index;
  }

  const winningOptions = legalCards
    .filter(item => doesCardBeat(item.card, currentWinningPlay.card))
    .sort((a, b) => rankPower[a.card.rank] - rankPower[b.card.rank]);

  if (winningOptions.length > 0) {
    return winningOptions[0].index;
  }

  return chooseLowestCard(legalCards).index;
}

function chooseLeadCard(legalCards) {
  const nonTrump = legalCards.filter(item => item.card.suit !== trumpSuit);
  const pool = nonTrump.length > 0 ? nonTrump : legalCards;

  pool.sort((a, b) => {
    const aCount = countSuitInHand(players[currentPlayerIndex].hand, a.card.suit);
    const bCount = countSuitInHand(players[currentPlayerIndex].hand, b.card.suit);

    if (aCount !== bCount) return bCount - aCount;
    return rankPower[b.card.rank] - rankPower[a.card.rank];
  });

  return pool[0].index;
}

function chooseLowestCard(cards) {
  const sorted = [...cards].sort((a, b) => {
    const aTrumpPenalty = a.card.suit === trumpSuit ? 20 : 0;
    const bTrumpPenalty = b.card.suit === trumpSuit ? 20 : 0;
    return (rankPower[a.card.rank] + aTrumpPenalty) - (rankPower[b.card.rank] + bTrumpPenalty);
  });

  return sorted[0];
}

function countSuitInHand(hand, suit) {
  return hand.filter(card => card.suit === suit).length;
}
