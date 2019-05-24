const { getRandomStr } = require('./random');

describe('Helpers suite:', function () {
  it('should random a string in a specific length', function () {
    const strLen = 12;
    expect(getRandomStr(strLen).length).toBe(strLen);
  });
});
