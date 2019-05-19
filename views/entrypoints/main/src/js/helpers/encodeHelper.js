export const fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
};

export const fixedEncodeURI = (str) => {
  return encodeURI(str)
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']');
};
