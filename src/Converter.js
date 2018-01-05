export function convertTitle(hand) {
    return `PokerStars Game #${hand.handId}:  Hold'em No Limit ($${hand.smallBlind.amount}/$${hand.bigBlind.amount} USD) - ${hand.timePlayed}`;
}

export function convertDescription(hand) {
    return `Table '${hand.tableName} ${hand.minBuyIn}-${hand.maxBuyIn} bb' ${hand.maxSeats}-max Seat #${hand.buttonSeatNumber} is the button`;
}

export function convertPlayerStartingChips(hand) {
    return hand.players.map(player => `Seat ${player.seatId}: ${player.name} ($${player.initialBalance} in chips)`).join('\n');
}

export function convertBlindsPosted(hand) {
    let output = '';

    if (hand.smallBlind.playerName) {
        output += `${hand.smallBlind.playerName}: posts small blind $${hand.smallBlind.amount}\n`;
    }

    output += `${hand.bigBlind.playerName}: posts big blind $${hand.bigBlind.amount}`;

    return output;
}

export function convertHoleCards(hand) {
    return `Dealt to ${hand.holeCards.playerName} [${hand.holeCards.cards}]`;
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
    let cards;
    if (hand.madeItToRiver) {
        cards = convertRiverCards(hand);
    } else if (hand.madeItToTurn) {
        cards = convertTurnCards(hand);
    } else if (hand.madeItToFlop) {
        cards = convertFlopCards(hand);
    } else {
        return 'Board []';
    }

    const replaced = cards.replace(/[[\]]+/gi, '');
    return `Board [${replaced}]`;
}

function buildOutputForActions(actions) {
    return actions.map(action => `${action.playerName}: ${action.action}`).join('\n');
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

export function convertPotInfo(hand) {
    return `Total pot $${hand.totalPot} | Rake $${hand.totalRake}`;
}

export function convertCardsShown(hand) {
    return hand.cardsShown.map(object => `${object.playerName}: shows [${object.cards}] (a hand...)`).join('\n');
}

export function convertPlayerSummary(hand) {
    return hand.playerSummaries.map((object) => {
        let output = `Seat ${object.seatNumber}: ${object.playerName} `;

        if (object.cardsShown) {
            output += `showed [${object.cardsShown}] `;
            // todo: hand valuation
            if (object.netWin > 0) {
                output += `and won ($${object.totalWin}) with (a hand...)`;
            } else {
                output += 'and lost with (a hand...)';
            }
        } else {
            if (object.netWin > 0) {
                output += `won ($${object.totalWin}) with (a hand...)`;
            } else {
                // todo: what street folded on
                output += 'folded';
            }

        }

        return output;
    }).join('\n');
}

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
