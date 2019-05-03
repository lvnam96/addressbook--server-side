// import chance from 'chance';
// import faker from 'faker/locale/vi';
import axios from 'axios';

export const getRandomStr = length => {
    // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
    let text = '';
    const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        POSSIBLE_SCOPE = POSSIBLE_CHARS.length;

    for (let i = 0; i < length; i += 1) {
        text += POSSIBLE_CHARS.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
    }

    return text;
};

export const getRandomColor = () => {
    let h = Math.floor(Math.random() * 360),
        s = Math.floor(Math.random() * 100) + '%',
        l = Math.floor(Math.random() * 60) + 20 + '%';
    return `hsl(${h},${s},${l})`;
};

// NEVER USE IT FOR REAL ID, GET REAL UUID
// IN RESPONSE AFTER SUBMIT NEW CONTACT TO SERVER
export const randomUUID = async () => {
    // return faker.random.uuid();
    const response = await axios.get('http://faker.hook.io/?property=random.uuid');
    return response.data;
};

export const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
};

export const formatNumbToStr = (numb, strLength) => {
    let str = numb + '';// convert type from number to string
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
