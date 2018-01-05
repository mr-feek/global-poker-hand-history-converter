'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convertTitle = convertTitle;
exports.convertDescription = convertDescription;
exports.convertPlayerStartingChips = convertPlayerStartingChips;
exports.convertBlindsPosted = convertBlindsPosted;
exports.convertHoleCards = convertHoleCards;
exports.convertFlopCards = convertFlopCards;
exports.convertTurnCards = convertTurnCards;
exports.convertRiverCards = convertRiverCards;
exports.convertFinalBoard = convertFinalBoard;
exports.convertPreFlopActions = convertPreFlopActions;
exports.convertFlopActions = convertFlopActions;
exports.convertTurnActions = convertTurnActions;
exports.convertRiverActions = convertRiverActions;
exports.convertPotInfo = convertPotInfo;
exports.convertCardsShown = convertCardsShown;
exports.convertPlayerSummary = convertPlayerSummary;
exports.convertHand = convertHand;
function convertTitle(hand) {
    return 'PokerStars Game #' + hand.handId + ':  Hold\'em No Limit ($' + hand.smallBlind + '/$' + hand.bigBlind + ' USD) - ' + hand.timePlayed;
}

function convertDescription(hand) {
    return 'Table \'' + hand.tableName + ' ' + hand.minBuyIn + '-' + hand.maxBuyIn + ' bb\' ' + hand.maxSeats + '-max Seat #' + hand.buttonSeatNumber + ' is the button';
}

function convertPlayerStartingChips(hand) {
    return hand.players.map(function (player) {
        return 'Seat ' + player.seatId + ': ' + player.name + ' ($' + player.initialBalance + ' in chips)';
    }).join('\n');
}

function convertBlindsPosted(hand) {
    return hand.smallBlindPlayerName + ': posts small blind $' + hand.smallBlind + '\n' + hand.bigBlindPlayerName + ': posts big blind $' + hand.bigBlind;
}

function convertHoleCards(hand) {
    return '[' + hand.holeCards + ']';
}

function convertFlopCards(hand) {
    return '[' + hand.flopCards + ']';
}

function convertTurnCards(hand) {
    return convertFlopCards(hand) + ' [' + hand.turnCard + ']';
}

function convertRiverCards(hand) {
    return convertTurnCards(hand) + ' [' + hand.riverCard + ']';
}

function convertFinalBoard(hand) {
    var cards = void 0;
    if (hand.madeItToRiver) {
        cards = convertRiverCards(hand);
    } else if (hand.madeItToTurn) {
        cards = convertTurnCards(hand);
    } else if (hand.madeItToFlop) {
        cards = convertFlopCards(hand);
    } else {
        return 'Board []';
    }

    var replaced = cards.replace(/[[\]]+/gi, '');
    return 'Board [' + replaced + ']';
}

function buildOutputForActions(actions) {
    return actions.map(function (action) {
        return action.playerName + ': ' + action.action;
    }).join('\n');
}

function convertPreFlopActions(hand) {
    return buildOutputForActions(hand.preFlopActions);
}

function convertFlopActions(hand) {
    return buildOutputForActions(hand.flopActions);
}

function convertTurnActions(hand) {
    return buildOutputForActions(hand.turnActions);
}

function convertRiverActions(hand) {
    return buildOutputForActions(hand.riverActions);
}

function convertPotInfo(hand) {
    return 'Total pot $' + hand.totalPot + ' | Rake $' + hand.totalRake;
}

function convertCardsShown(hand) {
    return hand.cardsShown.map(function (object) {
        return object.playerName + ' shows [' + object.cards + '] (a hand...)';
    }).join('\n');
}

function convertPlayerSummary(hand) {
    return hand.playerSummaries.map(function (object) {
        var output = 'Seat ' + object.seatNumber + ': ' + object.playerName + ' showed (a hand...) ';

        if (object.netWin > 0) {
            output += 'and won ' + object.totalWin;
        } else {
            output += 'and lost with (a hand...)';
        }

        return output;
    }).join('\n');
}

function convertHand(hand) {
    var outputParts = [convertTitle(hand), convertDescription(hand), convertPlayerStartingChips(hand), convertBlindsPosted(hand), '*** HOLE CARDS ***', convertHoleCards(hand), convertPreFlopActions(hand)];

    if (hand.madeItToFlop) {
        outputParts.push('*** FLOP *** ' + convertFlopCards(hand), convertFlopActions(hand));
    }

    if (hand.madeItToTurn) {
        outputParts.push('*** TURN *** ' + convertTurnCards(hand), convertTurnActions(hand));
    }

    if (hand.madeItToRiver) {
        outputParts.push('*** RIVER *** ' + convertRiverCards(hand), convertRiverActions(hand));
    }

    if (hand.madeItToShowDown) {
        outputParts.push('*** SHOW DOWN ***', convertCardsShown(hand));
    }

    outputParts.push('*** SUMMARY ***', convertPotInfo(hand), convertFinalBoard(hand), convertPlayerSummary(hand));

    return outputParts.filter(function (part) {
        return part !== '';
    }).join('\n');
}