import { describe, it } from 'mocha';
import assert from 'assert';
import {
    convertTitle,
    convertDescription,
    convertPlayerStartingChips,
    convertBlindsPosted,
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
} from '../../src/Converter';
import GlobalPokerHand from '../../src/GlobalPokerHand';
import fixture from '../Fixtures/CashHandMadeToRiverShowdown.json';
import CashHandWithPreFlopRaisesFixture from '../Fixtures/CashHandWithPreFlopRaises.json';

describe('Converter', () => {
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
                'Seat 1: mr_feek ($4.8 in chips)\n\
Seat 3: Player#3699 ($9.54 in chips)\n\
Seat 4: Player#4531 ($2.11 in chips)',
            );
        });
    });

    describe('#convertBlindsPosted()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertBlindsPosted(hand),
                'mr_feek: posts small blind $0.02\n\
Player#3699: posts big blind $0.04',
            );
        });
    });

    describe('#convertPreFlopActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertPreFlopActions(hand),
                'Player#4531: calls $0.04\n\
mr_feek: calls $0.02\n\
Player#3699: checks',
            );
        });

        it('determinesRaiseAmountsOverBlinds', () => {
            const hand = new GlobalPokerHand(CashHandWithPreFlopRaisesFixture);
            assert.equal(
                convertPreFlopActions(hand),
                'mr_feek: raises $0.08 to $0.12\n\
Player#7442: folds\n\
Player#6503: calls $0.1\n\
Player#8836: raises $0.36 to $0.48\n\
mr_feek: calls $0.36\n\
Player#6503: folds',
            );
        });
    });

    describe('#convertFlopActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFlopActions(hand),
                'mr_feek: bets $0.12\n\
Player#3699: calls $0.12\n\
Player#4531: calls $0.12',
            );
        });
    });

    describe('#convertTurnActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertTurnActions(hand),
                'mr_feek: bets $0.48\n\
Player#3699: calls $0.48\n\
Player#4531: folds',
            );
        });
    });

    describe('#convertRiverActions()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertRiverActions(hand),
                'mr_feek: bets $0.72\n\
Player#3699: raises $1.12 to $1.84\n\
mr_feek: raises $2.32 to $4.16\n\
Player#3699: calls $2.32',
            );
        });
    });

    describe('#convertHoleCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertHoleCards(hand),
                '[Jh Qc]',
            );
        });
    });

    describe('#convertFlopCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFlopCards(hand),
                '[9d Kc Td]',
            );
        });
    });

    describe('#convertTurnCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertTurnCards(hand),
                '[9d Kc Td] [6c]',
            );
        });
    });

    describe('#convertRiverCards()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertRiverCards(hand),
                '[9d Kc Td] [6c] [2s]',
            );
        });
    });

    describe('#convertPotInfo()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertPotInfo(hand),
                'Total pot $9.76 | Rake $0.48',
            );
        });
    });

    describe('#convertFinalBoard()', () => {
        it('works', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(
                convertFinalBoard(hand),
                'Board [9d Kc Td 6c 2s]',
            );
        });
    });
});
