const http = require('http');
const fs = require('fs');
const path = require('path');
const checkStorageAvailable = require('./helpers/checkSupportedFeaturesHelper');
const timeObj = require('./helpers/timeHelper');
// let timeObj = {},
//     checkStorageAvailable = () => {};
let isModified = false,
    needToBeReSorted = false,
    contactsList = JSON.parse(fs.readFileSync('./js/data.json', 'UTF-8')) || [];

const time = timeObj,
    isStorageAvailable = checkStorageAvailable('localStorage'),
    ____shouldBeSaved = () => {
        return isModified;
    },

    ____dontSaveDataToLocalStorageAgain = () => {
        isModified = false;
    },

    ____saveDataToLocalStorage = () => {
        localStorage.contactsList = JSON.stringify(contactsList);
    },

    ____rangeOfWeek = (today = time.curDay, toDate = time.curDate) => {
        //Calculate range (array) of days in current week
        const result = [],
            // toDate = testDateNum > -1 ? testDateNum : time.curDate,
            thisMonth = time.curMonth,
            thisYear = time.curYear,
            daysInMonth = time.daysInMonth,
            numberOfDaysInLastMonth = thisMonth === 1 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear),
            numberOfDaysInThisMonth = daysInMonth(thisMonth, thisYear),
            dayInNextMonth = thisMonth === 12 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear),
            firstDayInWeek = today - toDate + ((today - toDate < 1) ? numberOfDaysInLastMonth : 0),
            lastDayInWeek = today + 7 - toDate - 1 - ((today + 7 - toDate - 1 > numberOfDaysInThisMonth) ? numberOfDaysInThisMonth : 0);
            // lastDayInWeek = firstDayInWeek + 6 - ((firstDayInWeek + 6 > numberOfDaysInThisMonth) ? numberOfDaysInThisMonth : 0);

        if (firstDayInWeek > lastDayInWeek) {
            const condition = today > 15 ? numberOfDaysInThisMonth : numberOfDaysInLastMonth,
                lastDaysOfEndingMonth = [],
                firstDaysOfIncomingMonth = [];
            for (let i = firstDayInWeek; i <= condition; i++) {
                lastDaysOfEndingMonth.push(i);
            }
            for (let j = 1; j <= lastDayInWeek; j++) {
                firstDaysOfIncomingMonth.push(j);
            }
            result.push(lastDaysOfEndingMonth, firstDaysOfIncomingMonth);
        } else {
            for (let i = firstDayInWeek; i <= lastDayInWeek; i++) {
                result.push(i);
            }
        }

        return result;
    },

    ____getBirthsInMonth = (month = time.curMonth) => {
        return contactsList.filter((contact) => parseInt(contact.birth.split('-')[1], 10) === month).sort((a, b) => {
            let birthA = parseInt(a.birth.split('-')[2], 10),
                birthB = parseInt(b.birth.split('-')[2], 10);
            return birthA - birthB;
        });
    },

    ____getBirthsInWeek = (dayInWeekArr = rangeOfWeek()) => {
        const curDay = time.curDay,
            curMonth = time.curMonth,
            curYear = time.curYear,
            birthsInLastMonth = getBirthsInMonth((curMonth - 1) === 0 ? 12 : (curMonth - 1)),
            birthsInCurrentMonth = getBirthsInMonth(curMonth),
            birthsInNextMonth = getBirthsInMonth((curMonth + 1) === 13 ? 1 : (curMonth + 1));

        if (Array.isArray(dayInWeekArr[0])) {// if we have array, it means that we have a transforming-week: a week have days in current month & previous/next month
            let arr1, arr2;

            if (curDay > 15) {// we're in last days of the current month

                arr1 = birthsInCurrentMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[0].indexOf(birth) !== -1;
                }).sort((a, b) => {
                    const birthA = parseInt(a.birth.split('-')[2], 10),
                            birthB = parseInt(b.birth.split('-')[2], 10);
                    return birthA - birthB;
                });

                arr2 = birthsInNextMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[1].indexOf(birth) !== -1;
                }).sort((a, b) => {
                    const birthA = parseInt(a.birth.split('-')[2], 10),
                            birthB = parseInt(b.birth.split('-')[2], 10);
                    return birthA - birthB;
                });

            } else {// we're in first days of the current month

                arr1 = birthsInLastMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[0].indexOf(birth) !== -1;
                }).sort((a, b) => {
                    const birthA = parseInt(a.birth.split('-')[2], 10),
                            birthB = parseInt(b.birth.split('-')[2], 10);
                    return birthA - birthB;
                });

                arr2 = birthsInCurrentMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[1].indexOf(birth) !== -1;
                }).sort((a, b) => {
                    const birthA = parseInt(a.birth.split('-')[2], 10),
                            birthB = parseInt(b.birth.split('-')[2], 10);
                    return birthA - birthB;
                });

            }

            return arr1.concat(arr2); 

        } else {// we're in the middle of the current month

            return birthsInCurrentMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr.indexOf(birth) !== -1;
            }).sort((a, b) => {
                const birthA = parseInt(a.birth.split('-')[2], 10),
                        birthB = parseInt(b.birth.split('-')[2], 10);
                return birthA - birthB;
            });

        }
    },

    ____getListOfBirthsToday = () => {
        const today = time.curDay;
        return getBirthsInMonth().filter(contact => parseInt(contact.birth.split('-')[2], 10) === today);
    },

    getBirthsIncoming = () => {

    },

    ____filterBirthsToday = () => {
        // re-update happy-birthday list
        let birthsToday;

        if (needToBeReSorted) {
            birthsToday = getListOfBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);

        } else if (localStorage.lastVisited === `${time.curDay}/${time.curMonth}`) {
            // Memoization technique: no need to do the job if the func is called more than two times a day
            birthsToday = JSON.parse(localStorage.birthsToday);

        } else {
            birthsToday = getListOfBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);
            localStorage.lastVisited = `${time.curDay}/${time.curMonth}`;
        }

        contactsList.forEach(contact => {
            contact.hpbd = birthsToday.findIndex((contactHasBirthToday) => {
                return contactHasBirthToday.name === contact.name;
            }) >= 0 ? true : false;
        });
    },

    shouldBeSorted = () => {
        return needToBeReSorted;
    },

    dataNeedToBeSorted = () => {
        needToBeReSorted = true;
    },

    dontSortAgain = () => {
        needToBeReSorted = false;
    },

    ____sortContactsList = () => {
        // sort by name
        contactsList.sort((a, b) => {
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
    },

    ____getContactsList = () => {
        // it might be no need to sort, cause refresh() method in React app is handling this
        if (needToBeReSorted) {
            sortContactsList();
            needToBeReSorted = false;
        }
        // techniquely, we must not return reference to real app's data
        // but we do not want the app is too heavy (too many tasks to do) when its data becomes bigger
        return contactsList;
    },

    ____listLength = () => {
        return contactsList.length;
    },

    ____addContact = (newPersonObj) => {
        contactsList = [...contactsList, newPersonObj];
        isModified = true;
        needToBeReSorted = true;
    },

    ____replaceData = (newData = contactsList) => {
        contactsList = newData;
    },

    ____find = (IDList, callbackFunc, callbackObj) => {
        let len = contactsList.length;

        if (Array.isArray(IDList)) {
            IDList.forEach(IDStr => {
                contactsList.forEach((contact, i) => {
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

        } else if (typeof IDList === 'string') {// pass ID string when edit or just need to find index of the only person who has that ID in contactsList
            const IDStr = IDList;

            for (let i = 0; i < len; i += 1) {
                if (contactsList[i].id === IDStr) {
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
        if (isModified) {
            let updatedData = contactsList.filter(contact => contact);
            replaceData(updatedData);
        }
    },

    ____editContact = (editedContact, idx) => {
        // if (typeof idx === 'undefined') {// currying func (partially applied func) pattern
        //     return (idx) => {
        //         contactsList[idx] = {...editedContact};
        //         isModified = true;
        //         needToBeReSorted = true;
        //     };
        // }
        // contactsList[idx] = {...editedContact};
        if (typeof idx !== 'number') {
            throw new Error('index arg is not type of number');
        }

        contactsList = [
            ...contactsList.slice(0, idx),
            { ...editedContact },
            ...contactsList.slice(idx + 1)
        ];

        isModified = true;
        needToBeReSorted = true;
    },

    ____rmContact = (idx) => {
        // contactsList.splice(idx, 1);// không dùng được cách này nữa vì cần phải giữ thứ tự cho các chỉ số index của các contact trong array data (giúp cho callback của API.find() hoạt động đúng item khi remove nhiều item bằng callback).
        delete contactsList[idx];
        isModified = true;
    },

    ____rmAllContacts = () => {
        contactsList = [];
        isModified = true;
    },

    ____init = () => {
        // get data from localStorage if exist
        if (isStorageAvailable) {
            if (typeof localStorage.contactsList !== 'undefined') {
                const localData = JSON.parse(localStorage.contactsList);
                replaceData(localData);
                // getListOfBirthsToday();
                filterBirthsToday();
            }
        } else {
            alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
        }
    };

const API = {
    shouldBeSaved: ____shouldBeSaved,
    dontSaveDataToLocalStorageAgain: ____dontSaveDataToLocalStorageAgain,
    saveDataToLocalStorage: ____saveDataToLocalStorage,
    getBirthsInMonth: ____getBirthsInMonth,
    getBirthsInWeek: ____getBirthsInWeek,
    getListOfBirthsToday: ____getListOfBirthsToday,
    getBirthsIncoming,
    filterBirthsToday: ____filterBirthsToday,
    shouldBeSorted,
    dataNeedToBeSorted,
    dontSortAgain,
    sortContactsList: ____sortContactsList,
    getContactsList: ____getContactsList,
    listLength: ____listLength,
    addContact: ____addContact,
    replaceData: ____replaceData,
    find: ____find,
    editContact: ____editContact,
    rmContact: ____rmContact,
    rmAllContacts: ____rmAllContacts,
    init: ____init
};

const HTML404 = `<!DOCTYPE html>
<html>
<head><title>404 Page</title></head>
<body><h2>Your request is not found on our server</h2></body>
</html>`;

const server = http.createServer((req, res) => {
    console.log(`${req.method} request for ${req.url}`);

    if (req.url === '/api/addressbook/contacts/') {
        if (req.method.toLowerCase() === 'get') {
            res.writeHead(200, { 'Content-Type': 'text/json' });
            res.end(JSON.stringify(API.getContactsList()));
        } else if (req.method.toLowerCase() === 'post') {
            
        } else if (req.method.toLowerCase() === 'delete') {

        } else {
            res.end('Dafug???');
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(HTML404);
    }

}).listen(3000);
