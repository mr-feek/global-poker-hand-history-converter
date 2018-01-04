import GlobalPokerHand from './GlobalPokerHand';

export function convertHand(hand) {
    let title = convertTitle(hand);
    return 'asuh';
}

export function convertTitle(hand) {
    // PokerStars Game #109682170558:  Hold'em No Limit ($0.05/$0.10 USD) - 2014/01/06 7:47:13 ET'
    return `PokerStars Game #${hand.handId}:  Hold'em No Limit ($${hand.smallBlind}/$${hand.bigBlind} USD) - ${hand.timePlayed}`;
}
