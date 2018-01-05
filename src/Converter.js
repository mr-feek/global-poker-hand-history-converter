export function convertHand(hand) {
    let outputParts = [
        convertTitle(hand),
        convertDescription(hand),
        convertPlayerStartingChips(hand),
        convertBlindsPosted(hand),
        '*** HOLE CARDS ***',
        convertHoleCards(hand),
        convertPreFlopActions(hand),
    ];

    if (hand.madeItToFlop) {
        outputParts.push(
            `*** FLOP *** ${convertFlopCards(hand)}`,
            convertFlopActions(hand),
        );
    }

    if (hand.madeItToTurn) {
        outputParts.push(
            `*** TURN *** ${convertTurnCards(hand)}`,
            convertTurnActions(hand),
        );
    }

    if (hand.madeItToRiver) {
        outputParts.push(
            `*** RIVER *** ${convertRiverCards(hand)}`,
            convertRiverActions(hand),
        );
    }

    if (hand.madeItToShowDown) {
        outputParts.push(
            '*** SHOW DOWN ***',
            convertCardsShown(hand),
        );
    }

    outputParts.push(
        '*** SUMMARY ***',
        convertPotInfo(hand),
        convertFinalBoard(hand),
    );

    return outputParts.filter((part) => part !== '').join('\n');
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
    hand.players.forEach((player, index, array) => {
        output += `Seat ${player.seatId}: ${player.name} ($${player.initialBalance} in chips)`;
        if (index < array.length - 1) {
            output += '\n';
        }
    });
    return output;
}

export function convertBlindsPosted(hand) {
    return `${hand.smallBlindPlayerName}: posts small blind $${hand.smallBlind}\n\
${hand.bigBlindPlayerName}: posts big blind $${hand.bigBlind}`;
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

export function convertFinalBoard(hand) {
    let riverCards = convertRiverCards(hand);
    let replaced = riverCards.replace(/[\[\]]+/gi, '');
    return `Board [${replaced}]`;
}

export function convertPreFlopActions(hand) {
    return buildOutputForActions(hand.preFlopActions);
}

export function convertFlopActions(hand) {
    return buildOutputForActions(hand.flopActions);
}

export function convertTurnActions(hand) {
    return buildOutputForActions(hand.turnActions);
}

export function convertRiverActions(hand) {
    return buildOutputForActions(hand.riverActions);
}

function buildOutputForActions(actions) {
    let output = '';
    actions.forEach((action, index, array) => {
        output += `${action.playerName}: ${action.action}`;

        if (index < array.length - 1) {
            output += '\n';
        }
    });
    return output;
}

export function convertPotInfo(hand) {
    // Total pot $1.57 | Rake $0.07
    return `Total pot $${hand.totalPot} | Rake $${hand.totalRake}`;
}

export function convertCardsShown(hand) {
    let parts = [];
    hand.cardsShown.forEach((object) => {
        parts.push(`${object.playerName} shows [${object.cards}] (a hand...)`);
    });
    return parts.join('\n');
}
