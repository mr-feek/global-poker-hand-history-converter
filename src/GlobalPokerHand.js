import moment from 'moment';
import { CARDS, SUITS } from './PokerStars';

export default class GlobalPokerHand {

    constructor(handData) {
        this._handData = handData;

        this.handId = handData.id;
        this.smallBlind = handData.settings.smallBlind;
        this.bigBlind = handData.settings.bigBlind;

        let timestamp = handData.startTime;

        // 2014/01/06 7:47:13 ET
        this.timePlayed = moment(timestamp).format('YYYY/MM/DD h:m:s') + ' ET'; // todo: time zone

        this.tableName = handData.table.tableName;
        this.minBuyIn = 40; // todo
        this.maxBuyIn = 100; // todo
        this.maxSeats = handData.settings.capacity;

        let buttonPlayerId = handData.events.filter(event => event.type === 'PlayerCardsDealt')[2].playerId;
        this.buttonSeatNumber = handData.seats.find(seat => seat.playerId === buttonPlayerId).seatId + 1;

        this.totalPot = handData.results.transfers[0].pot.potSize; // todo: side pots?
        this.totalRake = handData.results.totalRake;

        this.cardsMap = {
            'ACE': CARDS.ACE,
            'TWO': CARDS.TWO,
            'THREE': CARDS.THREE,
            'FOUR': CARDS.FOUR,
            'FIVE': CARDS.FIVE,
            'SIX': CARDS.SIX,
            'SEVEN': CARDS.SEVEN,
            'EIGHT': CARDS.EIGHT,
            'NINE': CARDS.NINE,
            'TEN': CARDS.TEN,
            'JACK': CARDS.JACK,
            'QUEEN': CARDS.QUEEN,
            'KING': CARDS.KING,
        };

        this.suitsMap = {
            'SPADES': SUITS.SPADES,
            'CLUBS': SUITS.CLUBS,
            'HEARTS': SUITS.HEARTS,
            'DIAMONDS': SUITS.DIAMONDS,
        };
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
            seat.seatId++;
            return seat;
        });
    }

    get holeCards() {
        let event = this.handData.events.find((event) => {
            return event.type === 'PlayerCardsDealt' && event.cards[0].suit && event.cards[0].rank;
        });

        return this.convertCards(event.cards);
    }

    get flopCards() {
        let event = this.handData.events.find(event => event.type === 'TableCardsDealt');
        return this.convertCards(event.cards);
    }

    get turnCard() {
        let cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterFlopCardsDealt());
        return this.convertCard(cardEvent.cards[0]);
    }

    get riverCard() {
        let cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterTurnCardDealt());
        return this.convertCard(cardEvent.cards[0]);
    }

    static getNextCardEvent(events) {
        return events.find(event => event.type === 'TableCardsDealt');
    }

    convertCards(cards) {
        return cards.map((card) => {
            return this.convertCard(card);
        }).join(' ');
    }

    // converts a global poker hand to a poker stars hand. belongs in converter but im lazy
    convertCard(card) {
        let number = this.cardsMap[card.rank];
        let suit = this.suitsMap[card.suit];

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
        let events = this.handData.events;

        let lastCardDealtIndex = events.length -1 - events.slice().reverse().findIndex(event => event.type === 'PlayerCardsDealt');

        let preFlopEvents = events.slice(
            lastCardDealtIndex + 1,
            events.findIndex(event => event.type === 'PotUpdate')
        );

        return this.parseHandEvents(preFlopEvents);
    }

    get flopActions() {
        let slicedLeft = this.getActionsAfterFlopCardsDealt();
        let sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));

        return this.parseHandEvents(sliced);
    }

    get turnActions() {
        let slicedLeft = this.getActionsAfterTurnCardDealt();
        let sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));

        return this.parseHandEvents(sliced);
    }

    get riverActions() {
        let slicedLeft = this.getActionsAfterRiverCardDealt();
        let sliced = slicedLeft.slice(0, slicedLeft.findIndex(event => event.type === 'PotUpdate'));
        return this.parseHandEvents(sliced);
    }

    getActionsAfterFlopCardsDealt() {
        let events = this.handData.events;
        let flopCardsDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(flopCardsDealtIndex + 1);
    }

    getActionsAfterTurnCardDealt() {
        let events = this.getActionsAfterFlopCardsDealt();
        let turnCardsDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(turnCardsDealtIndex + 1);
    }

    getActionsAfterRiverCardDealt() {
        let events = this.getActionsAfterTurnCardDealt();
        let riverCardDealtIndex = events.findIndex(event => event.type === 'TableCardsDealt');
        return events.slice(riverCardDealtIndex + 1);
    }

    getPlayerNameById(playerId) {
        return this.handData.seats.find(seat =>  seat.playerId === playerId).name;
    }

    parseHandEvents(handActions) {
        let previousBet = this.bigBlind;
        let totalBetAmount = 0;
        let raiseAmount = 0;

        return handActions.map((event) => {
            switch(event.action) {
                case 'CALL':
                    event.action = `calls $${event.amount.amount}`;
                    break;
                case 'CHECK':
                    event.action = 'checks';
                    break;
                case 'FOLD':
                    event.action = 'folds';
                    break;
                case 'MUCK_CARDS':
                    // todo what does poker stars say when hand isn't shown at showdown?
                    event.action = 'mucks';
                    break;
                case 'RAISE':
                    totalBetAmount = event.amount.amount;
                    raiseAmount = (totalBetAmount - previousBet).toFixed(2);
                    event.action = `raises $${raiseAmount} to $${totalBetAmount}`;
                    previousBet = totalBetAmount;
                    break;
                case 'BET':
                    totalBetAmount = event.amount.amount;
                    event.action = `bets $${totalBetAmount}`;
                    previousBet = totalBetAmount;
                    break;
                case 'TIME_BANK':
                    // todo what does poker stars say when hand isn't shown at showdown?
                    event.action = 'UNKNOWN';
                    break;
                default:
                    throw `unknown action ${event.action}`;
            }

            event.playerName = this.getPlayerNameById(event.playerId);
            return event;
        }).filter(event => event.action !== 'UNKNOWN');
    }
}
