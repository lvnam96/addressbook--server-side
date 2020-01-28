// import chance from 'chance';
// import faker from 'faker/locale/vi';
import uuidv4 from 'uuid/v4';
// import faker from 'faker';
import randomColor from 'randomcolor';

export const getRandomStr = (length = 10) => {
  // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
  let text = '';
  const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const POSSIBLE_SCOPE = POSSIBLE_CHARS.length;

  for (let i = 0; i < length; i += 1) {
    text += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
  }

  return text;
};

export const getRandomColor = (format = 'hsl') => {
  return randomColor({
    format,
    alpha: 1,
    luminosity: 'dark',
  });
};

export const getRandomHslColor = () => {
  // let h = Math.floor(Math.random() * 360);
  // let s = Math.floor(Math.random() * 100) + '%';
  // let l = Math.floor(Math.random() * 60) + 20 + '%';
  // return `hsl(${h},${s},${l})`;
  return getRandomColor();
};

export const getRandomHexColor = () => {
  // const letters = '0123456789ABCDEF';
  // let color = '#';
  // for (let i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  // return color;
  return getRandomColor('hex');
};

export const getCSSColorString = (color) => {
  if (typeof color === 'string' && color.indexOf('#') === 0) {
    return color;
  } else if (color.r !== undefined) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  } else if (color.l !== undefined) {
    return `hsla(${color.h}, ${color.s}, ${color.l}, ${color.a})`;
  }
};

// NEVER USE IT FOR REAL ID, GET REAL UUID
// IN RESPONSE AFTER SUBMITTING NEW ENTITY TO SERVER
export const randomUUID = () => uuidv4(); // OR export const randomUUID = () => faker.random.uuid();

export const formatNumbToStr = (numb, strLength) => {
  let str = numb + ''; // convert type from number to string
  const addZero = (str, numberOfZeroToAdd) => {
    while (numberOfZeroToAdd > 0) {
      str = '0' + str;
      numberOfZeroToAdd--;
    }
    return str;
  };
  if (strLength > str.length) {
    const numberOfZeroToAdd = strLength - str.length;
    str = addZero(str, numberOfZeroToAdd);
  }
  return str;
};

export const formatContactName = (name) => name.trim().replace(/\s+/gim, ' ');
