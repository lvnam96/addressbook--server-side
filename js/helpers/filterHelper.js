import { timeObj as t, rangeOfWeek } from '../helpers/timeHelper';
import { sortByDay } from '../helpers/sortHelper';

export const getBirthsInMonth = (month = t.curMonth, contactsList) => {
    return sortByDay(contactsList.filter((contact) => parseInt(contact.birth.split('-')[1], 10) === month));
};

export const getBirthsInWeek = (dayInWeekArr = rangeOfWeek(), contactsList) => {
    const curDay = t.curDay,
        curMonth = t.curMonth,
        curYear = t.curYear,
        birthsInLastMonth = getBirthsInMonth((curMonth - 1) === 0 ? 12 : (curMonth - 1)),
        birthsInCurrentMonth = getBirthsInMonth(curMonth),
        birthsInNextMonth = getBirthsInMonth((curMonth + 1) === 13 ? 1 : (curMonth + 1));

    if (Array.isArray(dayInWeekArr[0])) {// if we have array, it means that we have a transforming-week: a week have days in current month & previous/next month
        let arr1, arr2;

        if (curDay > 15) {// we're in last days of the current month

            arr1 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr[0].indexOf(birth) !== -1;
            }));

            arr2 = sortByDay(birthsInNextMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr[1].indexOf(birth) !== -1;
            }));

        } else {// we're in first days of the current month

            arr1 = sortByDay(birthsInLastMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr[0].indexOf(birth) !== -1;
            }));

            arr2 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr[1].indexOf(birth) !== -1;
            }));

        }

        return arr1.concat(arr2);

    } else {// we're in the middle of the current month

        return sortByDay(birthsInCurrentMonth.filter((contact) => {
            const birth = parseInt(contact.birth.split('-')[2], 10);
            return dayInWeekArr.indexOf(birth) !== -1;
        }));

    }
};

export const getListOfBirthsToday = (contactsList) => {
    const today = t.curDay;
    return getBirthsInMonth().filter(contact => parseInt(contact.birth.split('-')[2], 10) === today);
};

export const filterBirthsToday = () => {
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
};
