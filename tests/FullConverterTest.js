let assert = require('assert');

import {
    convertHand
} from '../src/Converter';
import GlobalPokerHand from '../src/GlobalPokerHand';

import fixture from './Fixtures/CashHandMadeToRiverShowdown.json';

describe('Converter', () => {
    describe('#convertHand()', () => {
        it('convertsCashHandMadeToRiverShowdown', () => {
            const expected = "\
PokerStars Game #00d02b4c-8f1d-4fc4-8993-7ffe9758c177:  Hold'em No Limit ($0.02/$0.04 USD) - 2018/01/04 1:30:11 ET\n\
Table 'Odessa 40-100 bb' 6-max Seat #1 is the button\n\
Seat 1: mr_feek ($4.8 in chips)\n\
Seat 3: Player#3699 ($9.54 in chips)\n\
Seat 4: Player#4531 ($2.11 in chips)\n\
mr_feek: posts small blind $0.02\n\
Player#3699: posts big blind $0.04\n\
*** HOLE CARDS ***\n\
[Jh Qc]\n\
Player#4531: calls $0.04\n\
mr_feek: calls $0.02\n\
Player#3699: checks\n\
*** FLOP *** [9d Kc Td]\n\
mr_feek: bets $0.12\n\
Player#3699: calls $0.12\n\
Player#4531: calls $0.12\n\
*** TURN *** [9d Kc Td] [6c]\n\
mr_feek: bets $0.48\n\
Player#3699: calls $0.48\n\
Player#4531: folds\n\
*** RIVER *** [9d Kc Td] [6c] [2s]\n\
mr_feek: bets $0.72\n\
Player#3699: raises $1.12 to $1.84\n\
mr_feek: raises $2.32 to $4.16\n\
Player#3699: calls $2.32\n\
*** SUMMARY ***\n\
Total pot $9.76 | Rake $0.48\n\
Board [9d Kc Td 6c 2s]";
            const hand = new GlobalPokerHand(fixture);
            assert.equal(convertHand(hand), expected);
        });
    });
});
