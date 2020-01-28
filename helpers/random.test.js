const { getRandomStr, getStrongCryptoRandomStr, getRandomColor } = require('./random');

describe('Random helpers:', function () {
  it('should random a string in a specific length', function () {
    const strLen = Math.round(Math.random() * 20);
    expect(typeof getRandomStr()).toBe('string');
    expect(getRandomStr(strLen).length).toBe(strLen);
  });

  it('random strong crypto random string in length of 32', function () {
    expect(typeof getStrongCryptoRandomStr()).toBe('string');
    expect(getStrongCryptoRandomStr().length).toBe(32);
  });

  it('random color to one of types: hex (default), hsl, rgb', function () {
    const hexColor1 = getRandomColor();
    const hexColor2 = getRandomColor('hex');
    const hslColor = getRandomColor('hsl');
    const rgbColor = getRandomColor('rgb');

    expect(typeof hexColor1).toBe('string');
    expect(typeof hexColor2).toBe('string');
    expect(typeof hslColor).toBe('string');
    expect(typeof rgbColor).toBe('string');
  });
});
