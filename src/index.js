import { convertHand } from './Converter';
import GlobalPokerHand from './GlobalPokerHand';
const fs = require('fs');

const GLOBAL_POKER_HAND_HISTORY_FILE_LOCATION = '/Users/Feek/Desktop/global_poker/downloaded.json';
const OUTPUT_FILE_LOCATION = '/Users/Feek/Desktop/global_poker/converted.txt';

const handHistories = JSON.parse(fs.readFileSync(GLOBAL_POKER_HAND_HISTORY_FILE_LOCATION, 'utf8'));

const converted = handHistories.map((handHistoryBlob) => {
    return convertHand(new GlobalPokerHand(handHistoryBlob));
});

fs.writeFileSync(OUTPUT_FILE_LOCATION, converted.join('\n\n\n'), 'utf8');
