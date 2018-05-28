let isModified = false;

export const shouldBeSaved = () => {
        return isModified;
    },
    dontSaveAgain = () => {
        isModified = false;
    },
    save = (data) => {
        localStorage.contactsList = JSON.stringify(data);
    },
    loadData = () => JSON.parse(localStorage.contactsList);
