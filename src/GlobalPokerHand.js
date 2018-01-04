import moment from 'moment';

export default class GlobalPokerHand {
    constructor(handData) {
        this.handData = handData;

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

    getPlayerNameById(playerId) {
        return this.handData.seats.find(seat =>  seat.playerId === playerId).name;
    }

    parseHandEvents(handActions) {
        return handActions.map((event) => {
            switch(event.action) {
                case 'CALL': {
                    event.action = `calls $${event.amount.amount}`;
                    break;
                }
                case 'CHECK': {
                    event.action = 'checks';
                    break;
                }
                case 'MUCK_CARDS': {
                    event.action = 'folds';
                    break;
                }
            }

            event.playerName = this.getPlayerNameById(event.playerId);
            return event;
        });
    }
}
