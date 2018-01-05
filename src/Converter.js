export function convertHand(hand) {
    const outputParts = [
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
        convertPlayerSummary(hand),
    );

    return outputParts.filter(part => part !== '').join('\n');
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
    return hand.players.map(player => `Seat ${player.seatId}: ${player.name} ($${player.initialBalance} in chips)`).join('\n');
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
    const riverCards = convertRiverCards(hand);
    const replaced = riverCards.replace(/[\[\]]+/gi, '');
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
    return actions.map(action => `${action.playerName}: ${action.action}`).join('\n');
}

export function convertPotInfo(hand) {
    // Total pot $1.57 | Rake $0.07
    return `Total pot $${hand.totalPot} | Rake $${hand.totalRake}`;
}

export function convertCardsShown(hand) {
    return hand.cardsShown.map(object => `${object.playerName} shows [${object.cards}] (a hand...)`).join('\n');
}

export function convertPlayerSummary(hand) {
    return hand.playerSummaries.map((object) => {
        let output = `Seat ${object.seatNumber}: ${object.playerName} showed (a hand...) `;

        if (object.netWin > 0) {
            output += `and won ${object.totalWin}`;
        } else {
            output += 'and lost with (a hand...)';
        }

        return output;
    }).join('\n');
}
