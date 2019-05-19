const getRandomColor = () => {
  let h = Math.floor(Math.random() * 360);
  let s = Math.floor(Math.random() * 100) + '%';
  let l = Math.floor(Math.random() * 60) + 20 + '%';
  return `hsl(${h},${s},${l})`;
};

// const chance = require('chance');
// chance.string({ length: 10 });
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const getRandomStr = (string_length) => {
  let text = '';
  const POSSIBLE = '!@#$%^&*()_+-=?|:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const POSSIBLE_SCOPE = POSSIBLE.length;

  for (let i = 0; i < string_length; i += 1) {
    text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
  }

  return text;
};

module.exports = {
  getRandomStr,
  getRandomColor,
};
