'use strict';

var _Converter = require('./Converter');

var _GlobalPokerHand = require('./GlobalPokerHand');

var _GlobalPokerHand2 = _interopRequireDefault(_GlobalPokerHand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

var GLOBAL_POKER_HAND_HISTORY_FILE_LOCATION = '/Users/Feek/Desktop/global_poker/downloaded.json';
var OUTPUT_FILE_LOCATION = '/Users/Feek/Desktop/global_poker/converted.txt';

var handHistories = JSON.parse(fs.readFileSync(GLOBAL_POKER_HAND_HISTORY_FILE_LOCATION, 'utf8')).hands;

var converted = handHistories.map(function (handHistoryBlob) {
    return (0, _Converter.convertHand)(new _GlobalPokerHand2.default(handHistoryBlob));
});

fs.writeFileSync(OUTPUT_FILE_LOCATION, converted.join('\n'), 'utf8');