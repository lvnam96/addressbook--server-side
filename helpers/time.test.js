const { convertMillisecsToSeconds } = require('./time');
const ms = require('ms');

describe('Time helpers:', () => {
  describe('Helper: convertMillisecsToSeconds', () => {
    it('should return time in Seconds from Milliseconds', () => {
      const A_DAY_IN_MILLISECS = ms('1d');
      expect(convertMillisecsToSeconds(A_DAY_IN_MILLISECS)).toBe(86400);
    });
  });
});
