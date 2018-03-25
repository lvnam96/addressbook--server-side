export const origFind = (IDList, callbackFunc, callbackObj, data) => {
    let len = data.length;

    if (Array.isArray(IDList)) {
        IDList.forEach(IDStr => {
            data.forEach((contact, i) => {
                if (contact.id === IDStr) {
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

    } else if (typeof IDList === 'string') {
        // pass ID string when edit or just need to find index of the only person who has that ID in data
        const IDStr = IDList;

        for (let i = 0; i < len; i += 1) {
            if (data[i].id === IDStr) {
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

export const find = (IDStr, contactsList) => {
    if (typeof IDStr === 'string') {
        let len = contactsList.length;
        for (let i = 0; i < len; i += 1) {
            if (contactsList[i].id === IDStr) {
                return i;
            }
        }
    } else throw new Error('find() is invoked with an id whose typeof is not string');
};
