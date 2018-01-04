import moment from 'moment';

export default class GlobalPokerHand {
    constructor(handData) {
        this.handData = handData;

        this.handId = handData.id;
        this.smallBlind = handData.settings.smallBlind;
        this.bigBlind = handData.settings.bigBlind;

        let timestamp = handData.startTime;

        // 2014/01/06 7:47:13 ET
        this.timePlayed = moment(timestamp).format('YYYY/MM/DD h:m:s') + ' ET';
    }
}
