export const fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
};

export const fixedEncodeURI = (str) => {
  return encodeURI(str)
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']');
};

// http://www.2ality.com/2013/09/javascript-unicode.html
export const toUTF16 = (codePoint) => {
  var TEN_BITS = parseInt('1111111111', 2);
  function u (codeUnit) {
    return '\\u' + codeUnit.toString(16).toUpperCase();
  }

  if (codePoint <= 0xffff) {
    return u(codePoint);
  }
  codePoint -= 0x10000;

  // Shift right to get to most significant 10 bits
  var leadSurrogate = 0xd800 + (codePoint >> 10);

  // Mask to get least significant 10 bits
  var tailSurrogate = 0xdc00 + (codePoint & TEN_BITS);

  return u(leadSurrogate) + u(tailSurrogate);
};
