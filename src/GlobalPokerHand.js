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



        let buttonSeatId = handData.events.filter(event => event.type === 'PlayerCardsDealt')[2].playerId;
        this.buttonSeatNumber = handData.seats.find(seat => seat.playerId === buttonSeatId).seatId;
    }
}
