export function convertHand(hand) {
    // todo determine if blinds were posted
    return `
${convertTitle(hand)} 
${convertDescription(hand)} 
${convertPlayerStartingChips(hand)}
${convertBlindsPosted(hand)}
*** HOLE CARDS ***
${convertHoleCards(hand)}
${convertPreFlopActions(hand)}
*** FLOP *** ${convertFlopCards(hand)}
${convertFlopActions(hand)}
*** TURN *** ${convertTurnCards(hand)}
    `;
}

export function convertTitle(hand) {
    // PokerStars Game #109682170558:  Hold'em No Limit ($0.05/$0.10 USD) - 2014/01/06 7:47:13 ET'
    return `PokerStars Game #${hand.handId}:  Hold'em No Limit ($${hand.smallBlind}/$${hand.bigBlind} USD) - ${hand.timePlayed}`;
}

export function convertDescription(hand) {
    // Table 'Klinkenberg Zoom 40-100 bb' 6-max Seat #1 is the button
    return `Table '${hand.tableName} ${hand.minBuyIn}-${hand.maxBuyIn} bb' ${hand.maxSeats}-max Seat #${hand.buttonSeatNumber} is the button`;
}

export function convertPlayerStartingChips(hand) {
    let output = '';
    hand.players.forEach((player) => {
        output += `Seat ${player.seatId}: ${player.name} ($${player.initialBalance} in chips)\n`;
    });
    return output;
}

export function convertBlindsPosted(hand) {
    // todo
    return `Small Blind: posts small blind $${hand.smallBlind} \
    Big Blind: posts big blind $${hand.bigBlind}`;
}

export function convertHoleCards(hand) {
    return `[${hand.holeCards}]`;
}

export function convertFlopCards(hand) {
    return `[${hand.flopCards}]`;
}

export function convertTurnCards(hand) {
    return `${convertFlopCards(hand)} [${hand.turnCard}]`;
}

export function convertPreFlopActions(hand) {
    /**
     * UTG: folds
     UTG+1: folds
     UTG+2: folds
     Hero: raises $0.07 to $0.12
     Small Blind: calls $0.10
     * @type {string}
     */
    let output = '';
    hand.preFlopActions.forEach((action) => {
        output += `${action.playerName}: ${action.action}\n`;
    });
    return output;
}

export function convertFlopActions(hand) {
    let output = '';
    hand.flopActions.forEach((action) => {
        output += `${action.playerName}: ${action.action}\n`;
    });
    return output;
}
