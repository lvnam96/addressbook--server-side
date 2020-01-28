const doc = window.document;

export const preventBodyElemScrolling = () => {
  doc.body.classList.add('popup-open');
};

export const setBodyElemScrollable = () => {
  doc.body.classList.remove('popup-open');
};

export const stopPropagation = (e) => {
  e.stopPropagation();
};

export const stopEventBubbling = stopPropagation;

export const isPressedEscBtn = (e = window.event) => {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
};
