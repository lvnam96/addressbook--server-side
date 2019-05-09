export const sortByName = contactsList => {
    return contactsList.sort((a, b) => {
        const x = a.name.toLowerCase(),
            y = b.name.toLowerCase();
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    });
};

export const sortByDay = contactsList => {
    return contactsList.sort((a, b) => {
        let birthA, birthB;
        if (typeof a.birth === 'string') {
            birthA = parseInt(a.birth.split('-')[2], 10);
            birthB = parseInt(b.birth.split('-')[2], 10);
        } else {
            birthA = a.birth.getDate();
            birthB = b.birth.getDate();
        }
        return birthA - birthB;
    });
};
