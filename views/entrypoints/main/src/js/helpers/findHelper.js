export const getFirstLetterOf = (name) => {
  if (typeof name === 'string') {
    // eslint-disable-next-line no-control-regex
    const firstNotSpecialCharPtrn = /[^\u0000-\u007F]|[0-9a-zA-Z]/g;
    let firstLetter;
    name = name.trim();
    if (name !== '') {
      const firstLetterIdx = name.search(firstNotSpecialCharPtrn);
      firstLetter = firstLetterIdx !== -1 ? name[firstLetterIdx].toUpperCase() : '?';
    } else {
      firstLetter = '?';
    }
    return firstLetter;
  } else {
    throw new Error('getFirstLetterOf() required a string as the only argument');
  }
};
