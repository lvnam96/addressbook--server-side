export const getFirstLetterOf = (name = '') => {
  if (typeof name === 'string') {
    let firstLetter = '?';
    name = name.trim();
    if (name !== '') {
      // eslint-disable-next-line no-control-regex
      const firstLetterIdx = name.search(/[^\u0000-\u007F]|[0-9a-zA-Z]/g); // get the first not-special-character in string
      firstLetter = firstLetterIdx !== -1 ? name[firstLetterIdx].toUpperCase() : firstLetter;
    }
    return firstLetter;
  } else {
    throw new Error('getFirstLetterOf() required a string as the only argument');
  }
};
