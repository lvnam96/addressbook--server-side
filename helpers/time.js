const convertMillisecsToSeconds = (timeInMillisec) => {
  if (typeof timeInMillisec !== 'number') throw new Error('First argument must be a number');
  return timeInMillisec / 1000;
};

module.exports = {
  convertMillisecsToSeconds,
};
