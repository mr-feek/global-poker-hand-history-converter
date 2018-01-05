let assert = require('assert');

import {
    convertHand
} from '../src/Converter';
import GlobalPokerHand from '../src/GlobalPokerHand';

import fixture from './Fixtures/fixture.json';

describe('Converter', () => {
    describe('#convertHand()', () => {
        it('convertsCashHandMadeToRiverShowdown', () => {
            const hand = new GlobalPokerHand(fixture);
            assert.equal(convertHand(hand), "todo");
        });
    });
});
