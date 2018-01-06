import {describe, it} from 'mocha';
import {assert} from 'chai';
import {convertHand} from '../src/Converter';
import GlobalPokerHand from '../src/GlobalPokerHand';
import fixture from './Fixtures/CashHandMadeToRiverShowdown';
import CashHandEndingAtTurn from './Fixtures/CashHandEndingAtTurn';
import fixture2 from './Fixtures/bug';
import fixture3 from './Fixtures/bug2';
import CashGameNoSmallBlind from './Fixtures/CashGameNoSmallBlind';
import BigBlindWalkNoSmallBlindFixture from './Fixtures/BigBlindGetsWalkWithNoSmallBlindPosted';
import CashHandWithAPost from './Fixtures/CashHandWithAPost';
import SmallAndBigBlindPostedDead from './Fixtures/SmallAndBigBlindPostedDead';
import SplitPotNetLoss from './Fixtures/SplitPotNetLoss';

describe('Converter', () => {
    describe('#convertHand()', () => {
        it('convertsCashHandMadeToRiverShowdown', () => {
            const expected = '\
PokerStars Game #1515047411788:  Hold\'em No Limit ($0.02/$0.04 USD) - 2018/01/04 1:30:11 ET\n\
Table \'Odessa 40-100 bb\' 6-max Seat #4 is the button\n\
Seat 1: mr_feek ($4.8 in chips)\n\
Seat 3: Player#3699 ($9.54 in chips)\n\
Seat 4: Player#4531 ($2.11 in chips)\n\
mr_feek: posts small blind $0.02\n\
Player#3699: posts big blind $0.04\n\
*** HOLE CARDS ***\n\
Dealt to mr_feek [Jh Qc]\n\
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
mr_feek: raises $2.32 to $4.16 and is all-in\n\
Player#3699: calls $2.32\n\
*** SHOW DOWN ***\n\
mr_feek: shows [Jh Qc] (a straight)\n\
*** SUMMARY ***\n\
Total pot $9.76 | Rake $0.48\n\
Board [9d Kc Td 6c 2s]\n\
Seat 3: Player#3699 folded\n\
Seat 4: Player#4531 folded\n\
Seat 1: mr_feek showed [Jh Qc] and won ($9.28) with a straight';
            const hand = new GlobalPokerHand(fixture);
            assert.equal(convertHand(hand), expected);
        });

        it('convertsCashHandEndingAtTurn', () => {
            const expected = '\
PokerStars Game #1515047737811:  Hold\'em No Limit ($0.02/$0.04 USD) - 2018/01/04 1:35:37 ET\n\
Table \'Odessa 40-100 bb\' 6-max Seat #6 is the button\n\
Seat 1: mr_feek ($11.31 in chips)\n\
Seat 3: Player#5079 ($4.68 in chips)\n\
Seat 4: Player#9470 ($1.81 in chips)\n\
Seat 6: Player#8807 ($2 in chips)\n\
mr_feek: posts small blind $0.02\n\
Player#5079: posts big blind $0.04\n\
*** HOLE CARDS ***\n\
Dealt to mr_feek [3h Js]\n\
Player#9470: calls $0.04\n\
Player#8807: raises $0.14 to $0.18\n\
mr_feek: folds\n\
Player#5079: calls $0.14\n\
Player#9470: calls $0.14\n\
*** FLOP *** [5s 8h 7s]\n\
Player#5079: checks\n\
Player#9470: checks\n\
Player#8807: bets $0.56\n\
Player#5079: raises $0.56 to $1.12\n\
Player#9470: folds\n\
Player#8807: raises $0.70 to $1.82 and is all-in\n\
Player#5079: calls $0.7\n\
*** TURN *** [5s 8h 7s] [9d]\n\
*** RIVER *** [5s 8h 7s] [9d] [2d]\n\
*** SHOW DOWN ***\n\
Player#5079: shows [Ts 8c] (a pair)\n\
Player#8807: shows [6h Qh] (a straight)\n\
*** SUMMARY ***\n\
Total pot $4.2 | Rake $0.21\n\
Board [5s 8h 7s 9d 2d]\n\
Seat 3: Player#5079 showed [Ts 8c] and lost with a pair\n\
Seat 6: Player#8807 showed [6h Qh] and won ($3.99) with a straight\n\
Seat 4: Player#9470 folded\n\
Seat 1: mr_feek folded';
            const hand = new GlobalPokerHand(CashHandEndingAtTurn);
            assert.equal(convertHand(hand), expected);
        });

        it('convertsThisHandItWasBreakingOn', () => {
            // Just assert no errors thrown im lazy
            const hand = new GlobalPokerHand(fixture2);
            convertHand(hand);
        });

        it('convertsIfThereAreNoHoleCards', () => {
            // Just assert no errors thrown im lazy
            // this is if hero was not in the hand
            const hand = new GlobalPokerHand(fixture3);
            convertHand(hand);
        });

        it('convertsAHandWithNoSmallBlind', () => {
            // Just assert no errors thrown im lazy
            const hand = new GlobalPokerHand(CashGameNoSmallBlind);
            convertHand(hand);
        });

        it('convertsIfBigBlindGotAWalkAndNoSmallBlindWasPosted', () => {
            // This is a weird as hand, just going to ignore for now...
            const hand = new GlobalPokerHand(BigBlindWalkNoSmallBlindFixture);
            convertHand(hand);
        });

        it('convertsIfSomeonePostsAnotherBlind', () => {
            const expected = 'Player#8283: posts small blind $0.02\n\
Player#0528: posts big blind $0.04\n\
Player#6432: posts big blind $0.04';
            const hand = new GlobalPokerHand(CashHandWithAPost);
            assert.include(convertHand(hand), expected);
        });

        it('convertsIfSmallAndBigBlindsPosted', () => {
            const expected = 'Player#6081: posts small blind $0.02\n\
Player#7928: posts big blind $0.04\n\
Player#5378: posts small & big blind $0.06';
            const hand = new GlobalPokerHand(SmallAndBigBlindPostedDead);
            assert.include(convertHand(hand), expected);
        });

        it('convertsIfSplitPotNetLoss', () => {
            const expected = 'Seat 3: Player#2263 showed [Js Ad] and won ($1.6) with a pair\n\
Seat 1: Player#5265 folded\n\
Seat 6: Player#5368 showed [Jh Ah] and won ($1.6) with a pair';
            const hand = new GlobalPokerHand(SplitPotNetLoss);
            assert.include(convertHand(hand), expected);
        });
    });
});
