import { sortByDay } from './sortHelper';
import { formatNumbToStr } from './utilsHelper';
import { DateTime } from 'luxon';

export const displayDateObject = (dateObj, options) => {
    // return [dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear()].join('/');
    const birth = DateTime.fromISO(dateObj.toISOString());
    // return `${birth.day}/${birth.month}/${birth.year}`;
    return birth.toLocaleString(options);// MM/DD/YYYY
};

export const isLeap = (year) => {
    return !(year % 4 || (year % 100 === 0 && year % 400));
};

export const daysInMonth = (month, year) => {// calculate the number of days in a month
    const possibleDaysInFebruary = isLeap(year) ? 29 : 28;
    const possibleDaysInNormalMonths = 31 - (month - 1) % 7 % 2;
    return month === 2 ? possibleDaysInFebruary : possibleDaysInNormalMonths;
};

const t = (() => {
    const newDateObj = new Date();

        newDateObj.curDay = newDateObj.getDate;
        newDateObj.curYear = newDateObj.getFullYear;
        newDateObj.curDate = function () {
            // convert the original getDay() method:
            // myGetDay return the order of today in week,
            // the first date is Monday (not Sunday), still 0-based
            const day = this.getDay();
            return day === 0 ? 6 : day - 1;
        };
        newDateObj.curMonth = function () {
            return this.getMonth() + 1;
        };

    return newDateObj;
})();

export const timeObj = t;

export const convertMonthToText = num => {
    let month = parseInt(num);
    switch (month) {
    case 1:
        return 'Jan';
    case 2:
        return 'Feb';
    case 3:
        return 'Mar';
    case 4:
        return 'Apr';
    case 5:
        return 'May';
    case 6:
        return 'Jun';
    case 7:
        return 'Jul';
    case 8:
        return 'Aug';
    case 9:
        return 'Sep';
    case 10:
        return 'Oct';
    case 11:
        return 'Nov';
    case 12:
        return 'Dec';
    }
};

export const displayBirthday = (birth, format) => {
    let year, month, day;
    if (birth instanceof String) {
        // TO-DO: get day, month, year based on format
        switch (format) {
            case 'YYYY-MM-DD':

                break;
            case 'DD-MM-YYYY':

                break;
            default:
                if ((/\d{4}-\d{1,2}-\d{1,2}/).test(birth)) {// format: YYYY-MM-DD
                    const birthArr = birth.split('-');
                    year = birthArr[0];
                    month = convertMonthToText(birthArr[1]);
                    day = birthArr[2];
                    return `${month} ${day}, ${year}`;
                } else {// format: DD-MM-YYYY or MM-DD-YYYY ????
                    const birthArr = birth.split('-');
                    year = birthArr[2];
                    month = convertMonthToText(birthArr[1]);
                    day = birthArr[0];
                    return `${month} ${day}, ${year}`;
                }
        }
    } else if (birth instanceof Date) {
        // Old manual implement:
        // year = birth.getFullYear();
        // month = convertMonthToText(birth.getMonth() + 1);
        // return `${convertMonthToText(birth.getMonth() + 1)} ${birth.getDate()}, ${birth.getFullYear()}`;
        return displayDateObject(birth, DateTime.DATE_FULL);
    }
    return `${month} ${day}, ${year}`;
};

export const convertDateObjToHTMLInputVal = birth => {
    if (birth instanceof Date) {
        const yyyy = birth.getFullYear(),
            mm = formatNumbToStr(birth.getMonth() + 1, 2),
            dd = formatNumbToStr(birth.getDate(), 2);
        return `${yyyy}-${mm}-${dd}`;
    } else throw new Error('[helper: convertDateObjToHTMLInputVal] Input is not an instance of Date.');
};

// DONE
export const rangeOfWeek = (today = t.curDay(), toDate = t.curDate()) => {
    //Calculate range (array) of days in current week
    const result = [],
        // toDate = testDateNum > -1 ? testDateNum : t.curDate(),
        thisMonth = t.curMonth(),
        thisYear = t.curYear(),
        numberOfDaysInLastMonth = thisMonth === 1 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear),
        numberOfDaysInThisMonth = daysInMonth(thisMonth, thisYear),
        numberOfDaysInNextMonth = thisMonth === 12 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear),
        firstDayInWeek = today - toDate + ((today - toDate < 1) ? numberOfDaysInLastMonth : 0),
        lastDayInWeek = today + 7 - toDate - 1 - ((today + 7 - toDate - 1 > numberOfDaysInThisMonth) ? numberOfDaysInThisMonth : 0);
    // lastDayInWeek = firstDayInWeek + 6 - ((firstDayInWeek + 6 > numberOfDaysInThisMonth) ? numberOfDaysInThisMonth : 0);

    if (firstDayInWeek > lastDayInWeek) {
        // today > 15 && firstDayInWeek > lastDayInWeek let us know this week is the transforming week
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
};

// DONE
export const getBirthsInWeek = (contacts, dayInWeekArr = rangeOfWeek()) => {
    const curDay = t.curDay(),
        curMonth = t.curMonth(),
        curYear = t.curYear(),
        birthsInLastMonth = getBirthsInMonth(contacts, (curMonth - 1) === 0 ? 12 : (curMonth - 1)),
        birthsInCurrentMonth = getBirthsInMonth(contacts, curMonth),
        birthsInNextMonth = getBirthsInMonth(contacts, (curMonth + 1) === 13 ? 1 : (curMonth + 1));

    if (Array.isArray(dayInWeekArr[0])) {// if we have array, it means that we have a transforming-week: a week have days in current month & previous/next month
        let arr1, arr2;

        if (curDay > 15) {// we're in last days of the current month

            arr1 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                const birth = contact.birth ? contact.birth.getDate() : 0;
                return dayInWeekArr[0].indexOf(birth) !== -1;
            }));

            arr2 = sortByDay(birthsInNextMonth.filter((contact) => {
                const birth = contact.birth ? contact.birth.getDate() : 0;
                return dayInWeekArr[1].indexOf(birth) !== -1;
            }));

        } else {// we're in first days of the current month

            arr1 = sortByDay(birthsInLastMonth.filter((contact) => {
                const birth = contact.birth ? contact.birth.getDate() : 0;
                return dayInWeekArr[0].indexOf(birth) !== -1;
            }));

            arr2 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                const birth = contact.birth ? contact.birth.getDate() : 0;
                return dayInWeekArr[1].indexOf(birth) !== -1;
            }));

        }

        return arr1.concat(arr2);

    } else {// we're in the middle of the current month
        return sortByDay(birthsInCurrentMonth.filter((contact) => {
            const birth = contact.birth ? contact.birth.getDate() : 0;
            return dayInWeekArr.indexOf(birth) !== -1;
        }));
    }
};

// DONE
export const getBirthsInMonth = (contacts, month = t.curMonth()) => {
    const birthsInMonth = contacts.filter((contact) => {
        return contact.birth && (contact.birth.getMonth() + 1) === month;
    });
    return sortByDay(birthsInMonth);
};

export const getListOfBirthsToday = (contacts) => {
    const today = t.curDay(),
        birthsInMonth = getBirthsInMonth(contacts),
        birthsToday = birthsInMonth.filter(contact => contact.birth && contact.birth.getDate() === today);
    return birthsToday;
};

export const filterBirthsToday = (contacts) => {// re-update happy-birthday list
    // let birthsToday;

    // if (needToBeReSorted) {
    //     birthsToday = getListOfBirthsToday();
    //     localStorage.birthsToday = JSON.stringify(birthsToday);

    // } else if (localStorage.lastVisited === `${t.curDay()}/${t.curMonth()}`) {
    //     // Memoization technique: no need to do the job if the func is called more than two times a day
    //     birthsToday = JSON.parse(localStorage.birthsToday);

    // } else {
    //     birthsToday = getListOfBirthsToday();
    //     localStorage.birthsToday = JSON.stringify(birthsToday);
    //     localStorage.lastVisited = `${t.curDay()}/${t.curMonth()}`;
    // }
    const birthsToday = getListOfBirthsToday(contacts);
    return contacts.map(contact => {
        contact.hpbd = birthsToday.includes(contactHasBirthToday => {
                return contactHasBirthToday.name === contact.name;
        });
        return contact;
    });
};
