'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _PokerStars = require('./PokerStars');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GlobalPokerHand = function () {
    function GlobalPokerHand(handData) {
        _classCallCheck(this, GlobalPokerHand);

        this._handData = handData;

        this.handId = this.handData.id;
        this.smallBlind = this.handData.settings.smallBlind;
        this.bigBlind = this.handData.settings.bigBlind;
        this.smallBlindPlayerName = this.getPlayerNameById(this.handData.events.find(function (event) {
            return event.action === 'SMALL_BLIND';
        }).playerId);
        this.bigBlindPlayerName = this.getPlayerNameById(this.handData.events.find(function (event) {
            return event.action === 'BIG_BLIND';
        }).playerId);

        var timestamp = this.handData.startTime;

        // 2014/01/06 7:47:13 ET
        this.timePlayed = (0, _moment2.default)(timestamp).format('YYYY/MM/DD h:m:s') + ' ET'; // todo: time zone

        this.tableName = this.handData.table.tableName;
        this.minBuyIn = 40; // todo
        this.maxBuyIn = 100; // todo
        this.maxSeats = this.handData.settings.capacity;

        var buttonPlayerId = this.handData.events.filter(function (event) {
            return event.type === 'PlayerCardsDealt';
        })[2].playerId;
        this.buttonSeatNumber = this.handData.seats.find(function (seat) {
            return seat.playerId === buttonPlayerId;
        }).seatId + 1;

        this.totalPot = this.handData.results.transfers[0].pot.potSize; // todo: side pots?
        this.totalRake = this.handData.results.totalRake;

        this.cardsMap = {
            ACE: _PokerStars.CARDS.ACE,
            TWO: _PokerStars.CARDS.TWO,
            THREE: _PokerStars.CARDS.THREE,
            FOUR: _PokerStars.CARDS.FOUR,
            FIVE: _PokerStars.CARDS.FIVE,
            SIX: _PokerStars.CARDS.SIX,
            SEVEN: _PokerStars.CARDS.SEVEN,
            EIGHT: _PokerStars.CARDS.EIGHT,
            NINE: _PokerStars.CARDS.NINE,
            TEN: _PokerStars.CARDS.TEN,
            JACK: _PokerStars.CARDS.JACK,
            QUEEN: _PokerStars.CARDS.QUEEN,
            KING: _PokerStars.CARDS.KING
        };

        this.suitsMap = {
            SPADES: _PokerStars.SUITS.SPADES,
            CLUBS: _PokerStars.SUITS.CLUBS,
            HEARTS: _PokerStars.SUITS.HEARTS,
            DIAMONDS: _PokerStars.SUITS.DIAMONDS
        };
    }

    _createClass(GlobalPokerHand, [{
        key: 'convertCards',
        value: function convertCards(cards) {
            var _this = this;

            return cards.map(function (card) {
                return _this.convertCard(card);
            }).join(' ');
        }

        // converts a global poker hand to a poker stars hand. belongs in converter but im lazy

    }, {
        key: 'convertCard',
        value: function convertCard(card) {
            var number = this.cardsMap[card.rank];
            var suit = this.suitsMap[card.suit];

            return '' + number + suit;
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

    }, {
        key: 'getActionsAfterFlopCardsDealt',
        value: function getActionsAfterFlopCardsDealt() {
            var events = this.handData.events;

            var flopCardsDealtIndex = events.findIndex(function (event) {
                return event.type === 'TableCardsDealt';
            });
            return events.slice(flopCardsDealtIndex + 1);
        }
    }, {
        key: 'getActionsAfterTurnCardDealt',
        value: function getActionsAfterTurnCardDealt() {
            var events = this.getActionsAfterFlopCardsDealt();
            var turnCardsDealtIndex = events.findIndex(function (event) {
                return event.type === 'TableCardsDealt';
            });
            return events.slice(turnCardsDealtIndex + 1);
        }
    }, {
        key: 'getActionsAfterRiverCardDealt',
        value: function getActionsAfterRiverCardDealt() {
            var events = this.getActionsAfterTurnCardDealt();
            var riverCardDealtIndex = events.findIndex(function (event) {
                return event.type === 'TableCardsDealt';
            });
            return events.slice(riverCardDealtIndex + 1);
        }
    }, {
        key: 'getPlayerNameById',
        value: function getPlayerNameById(playerId) {
            if (!this.handData.seats.find(function (seat) {
                return seat.playerId === playerId;
            })) {
                console.error('could not find player name by player id. HAND: ' + this.handId + ' PlayerID: ' + playerId);
                //return '';
            }
            return this.handData.seats.find(function (seat) {
                return seat.playerId === playerId;
            }).name;
        }
    }, {
        key: 'parseHandEvents',
        value: function parseHandEvents(handActions) {
            var _this2 = this;

            var previousBet = this.bigBlind;
            var totalBetAmount = 0;
            var raiseAmount = 0;

            return handActions.map(function (event) {
                var action = '';

                switch (event.action) {
                    case 'CALL':
                        action = 'calls $' + event.amount.amount;

                        if (event.balanceAfterAction < 0) {
                            action += 'and is all-in';
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
                        // todo what does poker stars say when hand isn't shown at showdown?
                        event.action = 'mucks';
                        break;
                    case 'RAISE':
                        totalBetAmount = event.amount.amount;
                        raiseAmount = (totalBetAmount - previousBet).toFixed(2);
                        action = 'raises $' + raiseAmount + ' to $' + totalBetAmount;
                        previousBet = totalBetAmount;

                        if (event.balanceAfterAction < 0) {
                            action += 'and is all-in';
                        }

                        event.action = action;
                        break;
                    case 'BET':
                        totalBetAmount = event.amount.amount;
                        action = 'bets $' + totalBetAmount;
                        previousBet = totalBetAmount;

                        if (event.balanceAfterAction < 0) {
                            action += 'and is all-in';
                        }

                        event.action = action;
                        break;
                    case 'TIME_BANK':
                        // todo what does poker stars say when hand isn't shown at showdown?
                        event.action = 'UNKNOWN';
                        break;
                    default:
                        throw new Error('unknown action ' + event.action);
                }

                event.playerName = _this2.getPlayerNameById(event.playerId);
                return event;
            }).filter(function (event) {
                return event.action !== 'UNKNOWN';
            });
        }

        /**
         * @return Array { playerName: '', cards: 'Ah Th' }
         */

    }, {
        key: 'handData',
        get: function get() {
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

    }, {
        key: 'players',
        get: function get() {
            return this.handData.seats.map(function (seat) {
                seat.seatId++;
                return seat;
            });
        }
    }, {
        key: 'holeCards',
        get: function get() {
            var event = this.handData.events.find(function (e) {
                return e.type === 'PlayerCardsDealt' && e.cards[0].suit && e.cards[0].rank;
            });

            return this.convertCards(event.cards);
        }
    }, {
        key: 'flopCards',
        get: function get() {
            var event = this.handData.events.find(function (e) {
                return e.type === 'TableCardsDealt';
            });
            if (!event) {
                console.error('called .flopCards even though there were no events of type TableCardsDealt. HAND: ' + this.handId);
                //return;
            }
            return this.convertCards(event.cards);
        }
    }, {
        key: 'turnCard',
        get: function get() {
            var cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterFlopCardsDealt());
            if (!cardEvent) {
                console.error('called .turnCard even though there were no events of type TableCardsDealt. HAND: ' + this.handId);
                //return;
            }
            return this.convertCard(cardEvent.cards[0]);
        }
    }, {
        key: 'riverCard',
        get: function get() {
            var cardEvent = GlobalPokerHand.getNextCardEvent(this.getActionsAfterTurnCardDealt());
            if (!cardEvent) {
                console.error('called .riverCard even though there were no events of type TableCardsDealt. HAND: ' + this.handId);
                //return;
            }
            return this.convertCard(cardEvent.cards[0]);
        }
    }, {
        key: 'preFlopActions',
        get: function get() {
            var events = this.handData.events;


            var lastCardDealtIndex = events.length - 1 - events.slice().reverse().findIndex(function (event) {
                return event.type === 'PlayerCardsDealt';
            });

            var preFlopEvents = events.slice(lastCardDealtIndex + 1, events.findIndex(function (event) {
                return event.type === 'PotUpdate';
            }));

            return this.parseHandEvents(preFlopEvents);
        }
    }, {
        key: 'flopActions',
        get: function get() {
            var slicedLeft = this.getActionsAfterFlopCardsDealt();
            var sliced = slicedLeft.slice(0, slicedLeft.findIndex(function (event) {
                return event.type === 'PotUpdate';
            }));

            return this.parseHandEvents(sliced);
        }
    }, {
        key: 'turnActions',
        get: function get() {
            var slicedLeft = this.getActionsAfterTurnCardDealt();
            var sliced = slicedLeft.slice(0, slicedLeft.findIndex(function (event) {
                return event.type === 'PotUpdate';
            }));
            return this.parseHandEvents(sliced);
        }
    }, {
        key: 'riverActions',
        get: function get() {
            var slicedLeft = this.getActionsAfterRiverCardDealt();
            var sliced = slicedLeft.slice(0, slicedLeft.findIndex(function (event) {
                return event.type === 'PotUpdate';
            }));
            return this.parseHandEvents(sliced);
        }
    }, {
        key: 'cardsShown',
        get: function get() {
            var _this3 = this;

            return this.handData.events.filter(function (event) {
                return event.type === 'PlayerCardsExposed';
            }).map(function (event) {
                return {
                    playerName: _this3.getPlayerNameById(event.playerId),
                    cards: _this3.convertCards(event.cards)
                };
            });
        }
    }, {
        key: 'madeItToFlop',
        get: function get() {
            return this.handData.events.filter(function (event) {
                return event.type === 'TableCardsDealt';
            }).length >= 1;
        }
    }, {
        key: 'madeItToTurn',
        get: function get() {
            return this.handData.events.filter(function (event) {
                return event.type === 'TableCardsDealt';
            }).length >= 2;
        }
    }, {
        key: 'madeItToRiver',
        get: function get() {
            return this.handData.events.filter(function (event) {
                return event.type === 'TableCardsDealt';
            }).length >= 3;
        }
    }, {
        key: 'madeItToShowDown',
        get: function get() {
            return !!this.handData.events.find(function (event) {
                return event.type === 'ShowDownSummary';
            });
        }

        /**
         *
         * @return {Array} { playerName: '', totalWin: 10.00, netWin: 5.00 }
         */

    }, {
        key: 'playerSummaries',
        get: function get() {
            var _this4 = this;

            var results = Array.from(Object.values(this.handData.results.results));

            return results.map(function (result) {
                return {
                    seatNumber: _this4.players.find(function (player) {
                        return player.playerId === result.playerId;
                    }).seatId,
                    playerName: _this4.getPlayerNameById(result.playerId),
                    totalWin: result.totalWin, // total pot awarded
                    netWin: result.netWin // money won in this hand
                };
            });
        }
    }], [{
        key: 'getNextCardEvent',
        value: function getNextCardEvent(events) {
            return events.find(function (event) {
                return event.type === 'TableCardsDealt';
            });
        }
    }]);

    return GlobalPokerHand;
}();

exports.default = GlobalPokerHand;