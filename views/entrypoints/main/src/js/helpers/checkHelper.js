export const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null || obj === undefined) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export const isPromise = (obj) => {
  return obj instanceof Promise && typeof obj.then === 'function';
};
