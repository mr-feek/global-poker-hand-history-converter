export function convertHand(hand) {
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
${convertTurnActions(hand)}
*** RIVER *** ${convertRiverCards(hand)}
${convertRiverActions(hand)}
*** SUMMARY ***
${convertPotInfo(hand)}
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

export function convertRiverCards(hand) {
    return `${convertTurnCards(hand)} [${hand.riverCard}]`;
}

export function convertPreFlopActions(hand) {
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

export function convertTurnActions(hand) {
    let output = '';
    hand.turnActions.forEach((action) => {
        output += `${action.playerName}: ${action.action}\n`;
    });
    return output;
}

export function convertRiverActions(hand) {
    let output = '';
    hand.riverActions.forEach((action) => {
        output += `${action.playerName}: ${action.action}\n`;
    });
    return output;
}

export function convertPotInfo(hand) {
    // Total pot $1.57 | Rake $0.07
    return `Total pot $${hand.totalPot} | Rake $${hand.totalRake}`;
}
