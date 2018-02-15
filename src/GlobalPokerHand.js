import moment from 'moment-timezone';
import {CARDS, SUITS, HAND_VALUES, BETTING_TYPES, GAME_TYPES} from './PokerStars';

export default class GlobalPokerHand {
    constructor(handData) {
        this._handData = handData;

        this.handId = this.handData.startTime; // Using the global poker handId uuid overflows PT4 db column

        const timestamp = this.handData.startTime;

        // 2014/01/06 7:47:13 ET
        this.timePlayed = `${moment(timestamp).tz('America/New_York').format('YYYY/MM/DD H:m:s')} ET`;

        this.tableName = this.handData.table.tableName;
        this.minBuyIn = 40; // Todo
        this.maxBuyIn = 100; // Todo
        this.maxSeats = this.handData.settings.capacity;

        this.gameType = GAME_TYPES[this.handData.settings.variant];
        this.betting = BETTING_TYPES[this.handData.settings.betStrategyType];

        this.cardsMap = {
            ACE: CARDS.ACE,
            TWO: CARDS.TWO,
            THREE: CARDS.THREE,
            FOUR: CARDS.FOUR,
            FIVE: CARDS.FIVE,
            SIX: CARDS.SIX,
            SEVEN: CARDS.SEVEN,
            EIGHT: CARDS.EIGHT,
            NINE: CARDS.NINE,
            TEN: CARDS.TEN,
            JACK: CARDS.JACK,
            QUEEN: CARDS.QUEEN,
            KING: CARDS.KING,
        };

        this.suitsMap = {
            SPADES: SUITS.SPADES,
            CLUBS: SUITS.CLUBS,
            HEARTS: SUITS.HEARTS,
            DIAMONDS: SUITS.DIAMONDS,
        };

        this.handTypeMap = {
            STRAIGHT: HAND_VALUES.STRAIGHT,
            PAIR: HAND_VALUES.PAIR,
            TWO_PAIRS: HAND_VALUES.TWO_PAIR,
        };
    }

    get buttonSeatNumber() {
        // Man this sucks but theres literally no other way to figure it out..
        let {playerName} = this.bigBlind;

        if (this.smallBlind.playerName) {
            playerName = this.smallBlind.playerName;
        }

        const blindIndex = this.players.findIndex(player => player.name === playerName);
        if (blindIndex === 0) {
            // Go to end of array
            return this.players[this.players.length - 1].seatId;
        }

        const player = this.players[blindIndex - 1];

        if (!player) {
            // Sometimes there is no button
            return;
        }

        return player.seatId;
    }

    get smallBlind() {
        const blindEvent = this.handData.events.find(event => event.action === 'SMALL_BLIND');

        let playerName = '';

        if (blindEvent) {
            playerName = this.getPlayerNameById(blindEvent.playerId);
        }

        return {
            playerName,
            amount: this.handData.settings.smallBlind,
            type: 'small',
        };
    }

    get bigBlind() {
        const blindEvent = this.handData.events.find(event => event.action === 'BIG_BLIND');
        let playerName = '';

        if (blindEvent) {
            playerName = this.getPlayerNameById(blindEvent.playerId);
        }

        return {
            playerName,
            amount: this.handData.settings.bigBlind,
            type: 'big',
        };
    }

    get blindsPosted() {
        return [this.smallBlind, this.bigBlind].concat(this.getAdditionalBlindsPosted());
    }

    get pots() {
        const totalRake = this.handData.results.totalRake;

        // If there are no transfers, that means there was no small blind, and everyone folded. weird hand..
        const totalPot = this.handData.results.transfers ?
            this.handData.results.transfers.reduce((accumulator, transfer) => accumulator + transfer.pot.potSize, 0).toFixed(2) :
            0;

        const pots = [{
            description: `Total pot $${totalPot}.`,
        }];

        if (this.handData.results.transfers && this.handData.results.transfers.length > 1) {
            this.handData.results.transfers.forEach(transfer => {
                pots.push({
                    description: `${transfer.pot.type.charAt(0) + transfer.pot.type.slice(1).toLowerCase()} pot $${transfer.pot.potSize}.`,
                });
            });
        }

        pots.push({
            description: `| Rake $${totalRake}`,
        });

        return pots;
    }

    getAdditionalBlindsPosted() {
        return this.handData.events
            .filter(
                event => event.action === 'ENTRY_BET' ||
                event.action === 'DEAD_SMALL_BLIND' ||
                event.action === 'DEAD_BIG_BLIND' ||
                event.action === 'BIG_BLIND_PLUS_DEAD_SMALL_BLIND'
            ).map(event => {
                let type = '';

                if (event.amount.amount === this.bigBlind.amount) {
                    type = 'big';
                } else if (event.amount.amount < this.bigBlind.amount) {
                    type = 'small';
                } else {
                    type = 'small & big';
                }

                return {
                    playerName: this.getPlayerNameById(event.playerId),
                    amount: event.amount.amount,
                    type,
                };
            });
    }

    get handData() {
        return JSON.parse(JSON.stringify(this._handData));
    }

    /**
     *
     * @returns [] of Players. {
      "playerId":1359767,
      "initialBalance":4.8,
      "seatId":0,
      "name":"mr_feek"
    },
     {
       "playerId":3699,
       "initialBalance":9.54,
       "seatId":2,
       "name":"Player#3699"
     },
     {
       "playerId":4531,
       "initialBalance":2.11,
       "seatId":3,
       "name":"Player#4531"
     }
     *
     */
    get players() {
        return this.handData.seats.map(seat => {
            // global poker does seats 0-5, pt4 expects 1-6
            seat.seatId++;

            return seat;
        });
    }

    get holeCards() {
        const event = this.handData.events.find(e => e.type === 'PlayerCardsDealt' && e.cards[0].suit && e.cards[0].rank);
        if (!event) {
            return;
        }
        return {
            playerName: this.getPlayerNameById(event.playerId),
            cards: this.convertCards(event.cards),
        };
    }

    get flopCards() {
        const event = this.handData.events.find(e => e.type === 'TableCardsDealt');
        return this.convertCards(event.cards);
    }

    get turnCard() {
        const cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterFlopCardsDealt());
        return this.convertCard(cardEvent.cards[0]);
    }

    get riverCard() {
        const cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterTurnCardDealt());
        return this.convertCard(cardEvent.cards[0]);
    }

    static getNextCardEvent(events) {
        return events.find(event => event.type === 'TableCardsDealt');
    }

    convertCards(cards) {
        return cards.map(card => this.convertCard(card)).join(' ');
    }

    // Converts a global poker hand to a poker stars hand. belongs in converter but im lazy
    convertCard(card) {
        const number = this.cardsMap[card.rank];
        const suit = this.suitsMap[card.suit];

        return `${number}${suit}`;
    }

    /**
     *
     * @returns {Array}
     * [ { type: 'PlayerAction',
    time: 1515047425736,
    cards: [],
    action: 'CALL',
    amount: { type: 'BET', amount: 0.04 },
    timeout: false,
    playerId: 4531,
    balanceAfterAction: 2.07 },
     { type: 'PlayerAction',
       time: 1515047440390,
       cards: [],
       action: 'CALL',
       amount: { type: 'BET', amount: 0.02 },
       timeout: false,
       playerId: 1359767,
       balanceAfterAction: 4.76 },
     { type: 'PlayerAction',
       time: 1515047441110,
       cards: [],
       action: 'CHECK',
       amount: { type: 'BET', amount: 0 },
       timeout: false,
       playerId: 3699,
       playerName: 'mr_feek'
       balanceAfterAction: 9.5 } ]
     */
    get preFlopActions() {
        const {events} = this.handData;

        const lastCardDealtIndex = events.length - 1 - events.slice().reverse().findIndex(event => event.type === 'PlayerCardsDealt');

        const preFlopEvents = events.slice(
            lastCardDealtIndex + 1,
            events.findIndex(event => event.type === 'PotUpdate'),
        );

        return this.parseHandEvents(preFlopEvents);
    }

    get flopActions() {
        const slicedLeft = this.getActionsAfterFlopCardsDealt();
        const sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));

        return this.parseHandEvents(sliced);
    }

    get turnActions() {
        const slicedLeft = this.getActionsAfterTurnCardDealt();
        const sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));
        return this.parseHandEvents(sliced);
    }

    get riverActions() {
        const slicedLeft = this.getActionsAfterRiverCardDealt();
        const sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));
        return this.parseHandEvents(sliced);
    }

    getActionsAfterFlopCardsDealt() {
        const {events} = this.handData;
        const flopCardsDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(flopCardsDealtIndex + 1);
    }

    getActionsAfterTurnCardDealt() {
        const events = this.getActionsAfterFlopCardsDealt();
        const turnCardsDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(turnCardsDealtIndex + 1);
    }

    getActionsAfterRiverCardDealt() {
        const events = this.getActionsAfterTurnCardDealt();
        const riverCardDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(riverCardDealtIndex + 1);
    }

    getPlayerNameById(playerId) {
        return this.handData.seats.find(seat => seat.playerId === playerId).name;
    }

    parseHandEvents(handActions) {
        let previousBet = this.bigBlind.amount;
        let totalBetAmount = 0;
        let raiseAmount = 0;

        return handActions.map(event => {
            let action = '';

            switch (event.action) {
                case 'CALL':
                    action = `calls $${event.amount.amount}`;

                    if (event.balanceAfterAction <= 0) {
                        action += ' and is all-in';
                    }

                    event.action = action;
                    break;
                case 'CHECK':
                    event.action = 'checks';
                    break;
                case 'FOLD':
                    event.action = 'folds';
                    break;
                case 'MUCK_CARDS':
                    event.action = 'mucks hand';
                    break;
                case 'RAISE':
                    totalBetAmount = event.amount.amount;
                    raiseAmount = (totalBetAmount - previousBet).toFixed(2);
                    action = `raises $${raiseAmount} to $${totalBetAmount}`;
                    previousBet = totalBetAmount;

                    if (event.balanceAfterAction <= 0) {
                        action += ' and is all-in';
                    }

                    event.action = action;
                    break;
                case 'ENTRY_BET':
                    if (event.amount.amount === this.bigBlind.amount) {
                        action = 'posts big blind';
                    } else {
                        action = 'posts small blind';
                    }

                    break;
                case 'BET':
                    totalBetAmount = event.amount.amount;
                    action = `bets $${totalBetAmount}`;
                    previousBet = totalBetAmount;

                    if (event.balanceAfterAction <= 0) {
                        action += ' and is all-in';
                    }

                    event.action = action;
                    break;
                case 'TIME_BANK':
                // Todo what does poker stars say when hand isn't shown at showdown?
                    event.action = 'UNKNOWN';
                    break;
                default:
                    throw new Error(`unknown action ${event.action}`);
            }

            event.playerName = this.getPlayerNameById(event.playerId);
            return event;
        }).filter(event => event.action !== 'UNKNOWN');
    }

    /**
     * @return Array { playerName: '', cards: 'Ah Th' }
     */
    get cardsShown() {
        return this.handData.events
            .filter(event => event.type === 'PlayerCardsExposed')
            .map(event => ({
                playerName: this.getPlayerNameById(event.playerId),
                cards: this.convertCards(event.cards),
                handType: this.getPlayerHandType(event.playerId),
            }));
    }

    get madeItToFlop() {
        return this.handData.events.filter(event => event.type === 'TableCardsDealt').length >= 1;
    }

    get madeItToTurn() {
        return this.handData.events.filter(event => event.type === 'TableCardsDealt').length >= 2;
    }

    get madeItToRiver() {
        return this.handData.events.filter(event => event.type === 'TableCardsDealt').length >= 3;
    }

    get madeItToShowDown() {
        return Boolean(this.handData.events.find(event => event.type === 'ShowDownSummary'));
    }

    /**
     *
     * @return {Array} { playerName: '', totalWin: 10.00, netWin: 5.00 }
     */
    get playerSummaries() {
        const results = Array.from(Object.values(this.handData.results.results));

        return results.map(result => {
            const playerName = this.getPlayerNameById(result.playerId);
            const cardsShownObject = this.cardsShown.find(player => player.playerName === playerName);

            let cardsShown;
            let handType = 'hand';

            if (cardsShownObject) {
                cardsShown = cardsShownObject.cards;
                handType = cardsShownObject.handType;
            }

            return {
                seatNumber: this.players.find(player => player.playerId === result.playerId).seatId,
                playerName,
                cardsShown,
                totalWin: result.totalWin, // Total pot awarded
                netWin: result.netWin, // Money won in this hand
                handType,
            };
        });
    }

    getPlayerHandType(playerId) {
        const event = this.handData.events
            .filter(e => e.type === 'PlayerBestHand')
            .find(e => e.playerHand.playerId === playerId);
        if (!event) {
            return 'hand';
        }
        return this.handTypeMap[event.handInfoCommon.handType];
    }
}
