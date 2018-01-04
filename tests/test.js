let assert = require('assert');

import { convert } from '../src/converter';

describe('Converter', () => {
    describe('#convert()', () => {
        it('works', () => {
            assert.equal('asuh', convert(''))
        });
    });
});
