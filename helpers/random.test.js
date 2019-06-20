const { getRandomStr } = require('./random');

describe('Helpers suite:', function () {
  it('should random a string in a specific length', function () {
    const strLen = Math.round(Math.random() * 20);
    expect(getRandomStr(strLen).length).toBe(strLen);
  });

  it('has output as a string', function () {
    expect(typeof getRandomStr()).toBe('string');
  });
});
