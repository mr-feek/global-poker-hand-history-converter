let assert = require('assert');

import {
    convertHand,
    convertTitle,
    convertDescription,
    convertPlayerStartingChips,
    convertPreFlopActions,
    convertHoleCards,
    convertFlopCards,
    convertFlopActions,
    convertTurnActions,
    convertRiverActions,
    convertTurnCards,
    convertRiverCards,
    convertPotInfo,
    convertFinalBoard,
} from '../src/converter';
import GlobalPokerHand from '../src/GlobalPokerHand';

import fixture from './fixture.json';

describe('Converter', () => {
    describe('#convert()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            //assert.equal(getExpected(), convertHand(hand));
        });
    });

    describe('#convertTitle()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(convertTitle(hand), "PokerStars Game #00d02b4c-8f1d-4fc4-8993-7ffe9758c177:  Hold'em No Limit ($0.02/$0.04 USD) - 2018/01/04 1:30:11 ET");
        });
    });

    describe('#convertDescription()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(convertDescription(hand), "Table 'Odessa 40-100 bb' 6-max Seat #1 is the button");
        });
    });

    describe('#convertPlayerStartingChips()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertPlayerStartingChips(hand),
"Seat 1: mr_feek ($4.8 in chips)\n\
Seat 3: Player#3699 ($9.54 in chips)\n\
Seat 4: Player#4531 ($2.11 in chips)\n"
            );
        });
    });

    describe('#convertPreFlopActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertPreFlopActions(hand),
"Player#4531: calls $0.04\n\
mr_feek: calls $0.02\n\
Player#3699: checks\n"
            );
        });
    });

    describe('#convertFlopActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFlopActions(hand),
"mr_feek: bets $0.12\n\
Player#3699: calls $0.12\n\
Player#4531: calls $0.12\n"
            );
        });
    });

    describe('#convertTurnActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertTurnActions(hand),
"mr_feek: bets $0.48\n\
Player#3699: calls $0.48\n\
Player#4531: folds\n"
            );
        });
    });

    describe('#convertRiverActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertRiverActions(hand),
"mr_feek: bets $0.72\n\
Player#3699: raises $1.12 to $1.84\n\
mr_feek: raises $2.32 to $4.16\n\
Player#3699: calls $2.32\n"
            );
        });
    });

    describe('#convertHoleCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertHoleCards(hand),
                '[Jh Qc]'
            );
        });
    });

    describe('#convertFlopCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFlopCards(hand),
                '[9d Kc Td]'
            );
        });
    });

    describe('#convertTurnCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertTurnCards(hand),
                '[9d Kc Td] [6c]'
            );
        });
    });

    describe('#convertRiverCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertRiverCards(hand),
                '[9d Kc Td] [6c] [2s]'
            );
        });
    });

    describe('#convertPotInfo()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertPotInfo(hand),
                'Total pot $9.76 | Rake $0.48'
            );
        });
    });

    describe('#convertFinalBoard()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFinalBoard(hand),
                'Board [9d Kc Td 6c 2s]'
            );
        });
    });
});



function getExpected() {
    return "PokerStars Game #109682170558:  Hold'em No Limit ($0.05/$0.10 USD) - 2014/01/06 7:47:13 ET\n\
Table 'Klinkenberg Zoom 40-100 bb' 6-max Seat #1 is the button\n\
Seat 1: rocketsteph ($32.20 in chips)\n\
Seat 2: cenopelepi ($10.62 in chips)\n\
Seat 3: zoomast ($19.96 in chips)\n\
Seat 4: dem0n-GMRF ($10.15 in chips)\n\
Seat 5: shauneta ($4.59 in chips)\n\
Seat 6: pichcora 811 ($11.83 in chips)\n\
cenopelepi: posts small blind $0.05\n\
zoomast: posts big blind $0.10\n\
*** HOLE CARDS ***\n\
dem0n-GMRF: folds\n\
shauneta: folds\n\
pichcora 811: folds\n\
rocketsteph: folds\n\
cenopelepi: raises $0.22 to $0.32\n\
zoomast: folds\n\
Uncalled bet ($0.22) returned to cenopelepi\n\
cenopelepi collected $0.20 from pot\n\
cenopelepi: doesn't show hand\n\
*** SUMMARY ***\n\
Total pot $0.20 | Rake $0\n\
Seat 1: rocketsteph (button) folded before Flop (didn't bet)\n\
Seat 2: cenopelepi (small blind) collected ($0.20)\n\
Seat 3: zoomast (big blind) folded before Flop\n\
Seat 4: dem0n-GMRF folded before Flop (didn't bet)\n\
Seat 5: shauneta folded before Flop (didn't bet)\n\
Seat 6: pichcora 811 folded before Flop (didn't bet)\
    ";
}
