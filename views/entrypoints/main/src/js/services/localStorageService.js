let isModified = false;

export const shouldBeSaved = () => {
  return isModified;
};
export const dontSaveAgain = () => {
  isModified = false;
};
export const save = (data) => {
  localStorage['contactsList'] = JSON.stringify(data);
};
export const load = () => (localStorage['contactsList'] ? JSON.parse(localStorage['contactsList']) : null);
