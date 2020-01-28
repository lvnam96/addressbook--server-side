const { isIterable } = require('./checker');

describe('Checkers suite:', () => {
  it('should return false when checking all types in JS', () => {
    expect(isIterable([])).toEqual(true);
    expect(isIterable(new Set())).toEqual(true);
    expect(isIterable(new Map())).toEqual(true);
    expect(isIterable('')).toEqual(true);

    expect(isIterable({})).toEqual(false);
    expect(isIterable(0)).toEqual(false);
    expect(isIterable(1)).toEqual(false);
    expect(isIterable(true)).toEqual(false);
    expect(isIterable(false)).toEqual(false);
    expect(isIterable(new WeakSet())).toEqual(false);
    expect(isIterable(new WeakMap())).toEqual(false);
    expect(isIterable(null)).toEqual(false);
    expect(isIterable(undefined)).toEqual(false);
  });
});
