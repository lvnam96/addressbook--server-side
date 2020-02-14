const { isIterable, isValidUUID } = require('./checker');

describe('Checker helpers:', () => {
  describe('Helper: isIterable', () => {
    it('should return false when checking all types in JS', () => {
      expect(isIterable([])).toBe(true);
      expect(isIterable(new Set())).toBe(true);
      expect(isIterable(new Map())).toBe(true);
      expect(isIterable('')).toBe(true);
    });
    it('should return false when checking all non-iterable types in JS', () => {
      expect(isIterable({})).toBe(false);
      expect(isIterable(0)).toBe(false);
      expect(isIterable(1)).toBe(false);
      expect(isIterable(true)).toBe(false);
      expect(isIterable(false)).toBe(false);
      expect(isIterable(new WeakSet())).toBe(false);
      expect(isIterable(new WeakMap())).toBe(false);
      expect(isIterable(null)).toBe(false);
      expect(isIterable(undefined)).toBe(false);
    });
  });

  describe('Helper: isValidUUID', () => {
    const validUUID = 'ed5e92c4-661d-45f6-88b8-008b2566e3bb';
    it('should return true with valid UUID string', () => {
      expect(isValidUUID(validUUID)).toBe(true);
    });
    it('should return false with invalid UUID string', () => {
      expect(isValidUUID({})).toBe(false);
      expect(isValidUUID([])).toBe(false);
      expect(isValidUUID('validUUID')).toBe(false);
      expect(isValidUUID('')).toBe(false);
    });
  });
});
