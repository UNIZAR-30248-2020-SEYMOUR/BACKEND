var assert = require('assert');
const sum = require('../utils_example').sum
const substract = require('../utils_example').substract

describe('sum(2+2)', function() {
    it('should return 4', function() {
        assert.equal(sum(2,2), 4);
    });
});

describe('sum(3+2)', function() {
    it('should return 5', function() {
        assert.equal(sum(3,2), 5);
    });
});

describe('substract(2-2)', function() {
    it('should return 0', function() {
        assert.equal(substract(2,2), 0);
    });
});

describe('substract(3-2)', function() {
    it('should return 1', function() {
        assert.equal(substract(3,2), 1);
    });
});
