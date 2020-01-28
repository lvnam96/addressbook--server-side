let isModified = false;
const ls = window.localStorage;

export const shouldBeSaved = () => isModified;
export const dontSaveAgain = () => (isModified = false);
export const allowSavingNextTime = () => (isModified = true);
export const save = (data) => ls.setItem('reduxData', JSON.stringify(data));
export const load = () => (ls.getItem('reduxData') ? JSON.parse(ls.getItem('reduxData')) : null);
