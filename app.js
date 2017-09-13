'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import AddressBook from './components/AddressBook';

import './scss/style.scss';

const ADDRESS_BOOK = (function () {
    let IDList,
        maxID,
        isModified = false,
        needToBeReSorted = false,
        API = {},
        time,
        isStorageAvailable,
        contactsList = [
            {
                name: 'Awesome Man',
                id: 'e8dA',
                color: 'hsl(340,51%,51%)',
                labels: ['family'],
                birth: '1996-04-17',
                note: '',
                email: '',
                website: '',
                phone: '162664396'
            },
            {
                name: 'Batman',
                id: 'TjXD',
                color: 'hsl(179,40%,51%)',
                labels: ['friends','coWorker'],
                birth: '1996-11-27',
                note: '',
                email: '',
                website: 'http://batman.fake.com',
                phone: '123456789'
            },
            {
                name: 'Superman',
                id: '0CvB',
                color: 'hsl(262,66%,64%)',
                labels: ['coWorker'],
                birth: '1996-11-20',
                note: '',
                email: 'supergirl@iamnotgay.com',
                website: 'http://superman.vn',
                phone: '2541256847'
            }
        ];

    time = (() => {
        let newDateObj = new Date(),
            isLeap = (year) => {// tính năm nhuận
              if (year % 4 || (year % 100 === 0 && year % 400)) { return 0; }
              else { return 1; }
            },
            howManyDaysInMonth = (month, year) => {// tính ngày trong tháng
              return month === 2 ? (28 + isLeap(year)) : (31 - (month - 1) % 7 % 2);
            };

        // this is a local method of a local obj (newDateObj)
        newDateObj.myGetDay = function() {//  myGetDay(): trả về thứ trong tuần, ngày đầu trong tuần là thứ 2, 0-based
          let day = this.getDay();// getDay() trả về thứ trong tuần, ngày đầu trong tuần là chủ nhật, 0-based
          return day === 0 ? 6 : day - 1;
        };

        return {
          curDay: newDateObj.getDate(),
          curDate: newDateObj.myGetDay(), 
          curMonth: newDateObj.getMonth() + 1,
          curYear: newDateObj.getFullYear(),
          daysInMonth: howManyDaysInMonth
        };
    })();

    isStorageAvailable = ((type) => {
        try {
            let storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
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
    rangeOfWeek = (today = time.curDay, testDateNum) => {
        //Calculate range (array) of days in current week
        let result = [],
            toDate = testDateNum > -1 ? testDateNum : time.curDate,
            thisMonth = time.curMonth,
            thisYear = time.curYear,
            daysInMonth = time.daysInMonth,
            dayInLastMonth = (thisMonth - 1) === 0 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear),
            dayInThisMonth = daysInMonth(thisMonth, thisYear),
            dayInNextMonth = (thisMonth + 1) === 13 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear),
            startDayInWeek = today - toDate + ((today - toDate < 1) ? dayInLastMonth : 0),
            endDayInWeek = today + 7 - toDate - 1 - ((today + 7 - toDate - 1 > dayInThisMonth) ? dayInThisMonth : 0);

        if (startDayInWeek > endDayInWeek) {
            let condition = today > 15 ? dayInThisMonth : dayInLastMonth;
            result.push([], []);
            for (let i = startDayInWeek; i <= condition; i++) {
                result[0].push(i);
            }
            for (let j = 1; j <= endDayInWeek; j++) {
                result[1].push(j);
            }
        } else {
            for (let i = startDayInWeek; i <= endDayInWeek; i++) {
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
        let curDay = time.curDay,
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
        // let birthsToday;
        // birthsToday = getBirthsInMonth().filter(contact => parseInt(contact.birth.split('-')[2], 10) === today);
        // localStorage.birthsToday = JSON.stringify(birthsToday);
        // return birthsToday;
    },
    getBirthsIncoming = () => {

    },
    filterBirthsToday = () => {
        // re-update happy-birthday list
        let birthsToday;
        console.log(`${time.curDay}/${time.curMonth}`);
        console.log(localStorage.lastVisited);
        if (needToBeReSorted) {
            console.log("data is edited or a new contact's added");
            birthsToday = getBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);
        } else if (localStorage.lastVisited === `${time.curDay}/${time.curMonth}`) {
            console.log("visited more than ONE time today");
            // Memoization technique: no need to do the job if the func is called more than two times a day
            birthsToday = JSON.parse(localStorage.birthsToday);
        } else {
            console.log("first time visited today");
            birthsToday = getBirthsToday();
            localStorage.birthsToday = JSON.stringify(birthsToday);
            localStorage.lastVisited = `${time.curDay}/${time.curMonth}`;
        }
        console.log(birthsToday);
        contactsList.forEach(contact => {
            // contact.hpbd = birthsToday.indexOf(contact) >= 0 ? true : false;
            contact.hpbd = birthsToday.findIndex((contactHaveBirthToday) => {
                return contactHaveBirthToday.name === contact.name;
            }) >= 0 ? true : false;
        });
    },
    shouldBeSorted = () => {
        return needToBeReSorted;
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
            l = Math.floor(Math.random() * 60) + '%';
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
            IDList.forEach(function(IDStr) {
                contactsList.forEach(function(contact, index) {
                    if (contact.id === IDStr) {
                        if (callbackFunc && typeof callbackFunc === 'function') {
                            if (callbackObj && typeof callbackObj === 'object') {
                                callbackFunc.call(callbackObj, index);
                            } else {
                                callbackFunc(index);
                            }
                        }
                    }
                });
            });
        } else if (typeof IDList === 'string') {// pass ID string when edit or just need to find index of the only person who has that ID in contactsList
            for (let i = 0; i < len; i += 1) {
                if (contactsList[i].id === IDList) {
                    if (callbackFunc && typeof callbackFunc === 'function') {
                        if (callbackObj && typeof callbackObj === 'object') {
                            callbackFunc.call(callbackObj, i);
                        } else {
                            callbackFunc(i);
                        }
                    }
                    break;// Found contact -> execute callback -> stop loop (cause it's no need to loop anymore)
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
        // this func editContact is only currying func (partial application) in this app.
        if (typeof idx === 'undefined') {
            return (idx) => {
                contactsList[idx].name = editedContact.name;
                contactsList[idx].color = editedContact.color;
                contactsList[idx].birth = editedContact.birth;
                contactsList[idx].labels = editedContact.labels;
                contactsList[idx].email = editedContact.email;
                contactsList[idx].phone = editedContact.phone;
                contactsList[idx].website = editedContact.website;
                contactsList[idx].note = editedContact.note;
                isModified = true;
                needToBeReSorted = true;
            };
        }
        contactsList[idx].name = editedContact.name;
        contactsList[idx].color = editedContact.color;
        contactsList[idx].birth = editedContact.birth;
        contactsList[idx].labels = editedContact.labels;
        contactsList[idx].email = editedContact.email;
        contactsList[idx].phone = editedContact.phone;
        contactsList[idx].website = editedContact.website;
        contactsList[idx].note = editedContact.note;
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
        if (isStorageAvailable) {
            if (typeof localStorage.contactsList !== 'undefined') {
                const localStorageData = JSON.parse(localStorage.contactsList);
                replaceData(localStorageData);
                getBirthsToday();
            }
            filterBirthsToday();
        } else {
            alert('Sorry, your browser does NOT support Local Storage.\nWe will not be able to save your data.');
        }
    };

    return {
        shouldBeSaved,
        dontSaveDataToLocalStorageAgain,
        saveDataToLocalStorage,
        rangeOfWeek,
        getBirthsInMonth,
        getBirthsInWeek,
        getBirthsToday,
        getBirthsIncoming,
        filterBirthsToday,
        shouldBeSorted,
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

ADDRESS_BOOK.init();

document.addEventListener('DOMContentLoaded', () => {
    const checkedList = [],
        clsTab = (e) => {
            e = e || window.event;
            if (ADDRESS_BOOK.shouldBeSaved()) {
                ADDRESS_BOOK.saveDataToLocalStorage();
                ADDRESS_BOOK.dontSaveDataToLocalStorageAgain();
            }
            if (e) { e.returnValue = 'Sure?'; }// For IE and Firefox prior to version 4
            return 'Sure?';// For Safari
        };

    ReactDOM.render(<AddressBook API={ADDRESS_BOOK} />, document.getElementsByClassName('body-wrapper')[0]);

    window.addEventListener('beforeunload', clsTab, false);
});
