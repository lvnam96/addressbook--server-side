export default (function () {
    let isModified = false,
        needToBeReSorted = false,
        contactsList = [];

    const time = (() => {
        const newDateObj = new Date(),
            isLeap = year => {
              if (year % 4 || (year % 100 === 0 && year % 400)) { return 0; }
              else { return 1; }
            },
            howManyDaysInMonth = (month, year) => {// tính ngày trong tháng
              return month === 2 ? (28 + isLeap(year)) : (31 - (month - 1) % 7 % 2);
            },
            myGetDay = () => {// trả về thứ trong tuần, ngày đầu trong tuần là thứ 2, 0-based
                let day = newDateObj.getDay();// getDay() trả về thứ trong tuần, ngày đầu trong tuần là chủ nhật, 0-based
                return day === 0 ? 6 : day - 1;
            };

        return {
          curDay: newDateObj.getDate(),// day in month
          curDate: myGetDay(),// weekdays
          curMonth: newDateObj.getMonth() + 1,// month
          curYear: newDateObj.getFullYear(),// year
          daysInMonth: howManyDaysInMonth
        };
    })(),

    isStorageAvailable = (type => {
        try {
            let storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
        }
    })('localStorage');

    const shouldBeSaved = () => {
        return isModified;
    },

    dontSaveDataToLocalStorageAgain = () => {
        isModified = false;
    },

    saveDataToLocalStorage = () => {
        localStorage.contactsList = JSON.stringify(contactsList);
    },

    rangeOfWeek = (today = time.curDay, toDate = time.curDate) => {
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

    getBirthsInMonth = (month = time.curMonth) => {
        return contactsList.filter((contact) => parseInt(contact.birth.split('-')[1], 10) === month).sort((a, b) => {
            let birthA = parseInt(a.birth.split('-')[2], 10),
                birthB = parseInt(b.birth.split('-')[2], 10);
            return birthA - birthB;
        });
    },

    getBirthsInWeek = (dayInWeekArr = rangeOfWeek()) => {
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

    getBirthsToday = () => {
        const today = time.curDay;
        return getBirthsInMonth().filter(contact => parseInt(contact.birth.split('-')[2], 10) === today);
    },

    getBirthsIncoming = () => {

    },

    filterBirthsToday = () => {
        // re-update happy-birthday list
        let birthsToday;

        if (needToBeReSorted) {
            birthsToday = getBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);

        } else if (localStorage.lastVisited === `${time.curDay}/${time.curMonth}`) {
            // Memoization technique: no need to do the job if the func is called more than two times a day
            birthsToday = JSON.parse(localStorage.birthsToday);

        } else {
            birthsToday = getBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);
            localStorage.lastVisited = `${time.curDay}/${time.curMonth}`;
        }

        contactsList.forEach(contact => {
            contact.hpbd = birthsToday.findIndex((contactHaveBirthToday) => {
                return contactHaveBirthToday.name === contact.name;
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

    sortContactsList = () => {
        // sort by name
        contactsList.sort((a, b) => {
            const x = a.name.toLowerCase(),
                y = b.name.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });
    },

    getContactsList = () => {
        // it might be no need to sort, cause refresh() method in React app is handling this
        if (needToBeReSorted) {
            sortContactsList();
            needToBeReSorted = false;
        }
        // techniquely, we must not return reference to real app's data
        // but we do not want the app is too heavy (too many tasks to do) when its data becomes bigger
        return contactsList;
    },

    listLength = () => {
        return contactsList.length;
    },

    getRandomId = (string_length) => {
        // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
        let text = '';
        const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            POSSIBLE_SCOPE = POSSIBLE.length;

        for (let i = 0; i < string_length; i += 1) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
        }

        return text;
    },

    getRandomColor = () => {
        let h = Math.floor(Math.random() * 360),
            s = Math.floor(Math.random() * 100) + '%',
            l = Math.floor(Math.random() * 60) + 20 + '%';
        return `hsl(${h},${s},${l})`;
    },

    addContact = (newPersonObj) => {
        contactsList.push(newPersonObj);
        isModified = true;
        needToBeReSorted = true;
    },

    replaceData = (newData = contactsList) => {
        contactsList = newData;
    },

    find = (IDList, callbackFunc, callbackObj) => {
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

    editContact = (editedContact, idx) => {
        // if (typeof idx === 'undefined') {// currying func (partially applied func) pattern
        //     return (idx) => {
        //         contactsList[idx] = {...editedContact};
        //         isModified = true;
        //         needToBeReSorted = true;
        //     };
        // }
        contactsList[idx] = {...editedContact};

        isModified = true;
        needToBeReSorted = true;
    },

    rmContact = (idx) => {
        // contactsList.splice(idx, 1);// không dùng được cách này nữa vì cần phải giữ thứ tự cho các chỉ số index của các contact trong array data (giúp cho callback của API.find() hoạt động đúng item khi remove nhiều item bằng callback).
        delete contactsList[idx];
        isModified = true;
    },

    rmAllContacts = () => {
        contactsList = [];
        isModified = true;
    },

    init = () => {
        // get data from localStorage
        if (isStorageAvailable && typeof localStorage.contactsList !== 'undefined') {
            const localData = JSON.parse(localStorage.contactsList);
            replaceData(localData);
            // getBirthsToday();
            filterBirthsToday();
        } else {
            alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
        }
    };

    return {
        shouldBeSaved,
        dontSaveDataToLocalStorageAgain,
        saveDataToLocalStorage,
        getBirthsInMonth,
        getBirthsInWeek,
        getBirthsToday,
        getBirthsIncoming,
        filterBirthsToday,
        shouldBeSorted,
        dataNeedToBeSorted,
        dontSortAgain,
        sortContactsList,
        getContactsList,
        listLength,
        getRandomId,
        getRandomColor,
        addContact,
        replaceData,
        find,
        editContact,
        rmContact,
        rmAllContacts,
        init
    };
}());
