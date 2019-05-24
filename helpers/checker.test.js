const isIterable = require('./checker');

describe('Checker suite:', () => {
  it('should return false when checking object', () => {
    expect(isIterable([])).toEqual(true);
  });
});
