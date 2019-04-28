export const origFind = (idList, callbackFunc, callbackObj, data) => {
    let len = data.length;

    if (Array.isArray(idList)) {
        idList.forEach(id => {
            data.forEach((contact, i) => {
                if (contact.id === id) {
                    if (!(callbackFunc && typeof callbackFunc === 'function')) {
                        throw new Error('Callback is required if first argument is an array!');
                    } else if (callbackObj && typeof callbackObj === 'object') {
                        callbackFunc.call(callbackObj, i);
                    } else {
                        callbackFunc(i);
                    }
                }
            });
        });
    } else if (typeof idList === 'string') {
        // pass ID string when edit or just need to find index of the only person who has that ID in data
        const id = idList;
        for (let i = 0; i < len; i += 1) {
            if (data[i].id === id) {
                if (callbackFunc && typeof callbackFunc === 'function') {
                    if (callbackObj && typeof callbackObj === 'object') {
                        callbackFunc.call(callbackObj, i);
                    } else {
                        callbackFunc(i);
                    }
                    break;
                } else {
                    return i;
                }
            }
        }
    }

    // if there's a change in data (by removing contact), re-filter data to completely remove contact(s)
    // if (isModified) {
    //     let updatedData = data.filter(contact => contact);
    //     replaceData(updatedData);
    // }
};

export const find = (id, contactsList) => {
    if (typeof id === 'string') {
        let len = contactsList.length;
        for (let i = 0; i < len; i += 1) {
            if (contactsList[i].id === id) {
                return i;
            }
        }
    } else throw new Error('find() is invoked with an id whose type is not string');
};

export const getFirstLetterOf = name => {
    if (typeof name === 'string') {
        const firstNotSpecialCharPtrn = /[^\u0000-\u007F]|[0-9a-zA-Z]/g;
        let firstLetter;
        name = name.trim();
        if (name !== '') {
            const firstLetterIdx = name.search(firstNotSpecialCharPtrn);
            firstLetter = firstLetterIdx !== -1 ? name[firstLetterIdx].toUpperCase() : '?';
        } else {
            firstLetter = '?';
        }
        return firstLetter;
    } else {
        throw new Error('getFirstLetterOf() required a string as the only argument');
    }
};
