const doc = document;
export const preventBodyElemScrolling = () => {
  doc.body.classList.add('popup-open');
};
export const setBodyElemScrollable = () => {
  doc.body.classList.remove('popup-open');
};
