import { sortByDay } from './sortHelper';
import { formatNumbToStr } from './utilsHelper';
import { DateTime } from 'luxon';

export const displayDateObject = (dateObj, options) => {
  const birth = DateTime.fromISO(dateObj.toISOString());
  return birth.toLocaleString(options);
};

export const isLeap = (year) => {
  return !(year % 4 || (year % 100 === 0 && year % 400));
};

export const daysInMonth = (month, year) => {
  // calculate the number of days in a month
  const possibleDaysInFebruary = isLeap(year) ? 29 : 28;
  const possibleDaysInNormalMonths = 31 - (((month - 1) % 7) % 2);
  return month === 2 ? possibleDaysInFebruary : possibleDaysInNormalMonths;
};

const t = (() => {
  const newDateObj = new Date();

  newDateObj.curDay = newDateObj.getDate;
  newDateObj.curYear = newDateObj.getFullYear;
  newDateObj.curDate = function() {
    // convert the original getDay() method:
    // myGetDay return the order of today in week,
    // the first date is Monday (not Sunday), still 0-based
    const day = this.getDay();
    return day === 0 ? 6 : day - 1;
  };
  newDateObj.curMonth = function() {
    return this.getMonth() + 1;
  };

  return newDateObj;
})();

export const timeObj = t;

export const convertMonthToText = (num) => {
  const month = parseInt(num);
  const monthMap = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };
  return monthMap[month];
};

export const displayDate = (date, format) => {
  let year, month, day;
  if (date instanceof String) {
    const birthArr = date.split('-');
    // TO-DO: get day, month, year based on format
    switch (format) {
      case 'YYYY-MM-DD':
        break;
      case 'DD-MM-YYYY':
        break;
      default:
        if (/\d{4}-\d{1,2}-\d{1,2}/.test(date)) {
          // format: YYYY-MM-DD
          year = birthArr[0];
          month = convertMonthToText(birthArr[1]);
          day = birthArr[2];
        } else {
          // format: DD-MM-YYYY or MM-DD-YYYY ????
          year = birthArr[2];
          month = convertMonthToText(birthArr[1]);
          day = birthArr[0];
        }
    }
    return `${month} ${day}, ${year}`;
  } else if (date instanceof Date) {
    // Old implementation:
    // year = date.getFullYear();
    // month = convertMonthToText(date.getMonth() + 1);
    // return `${convertMonthToText(date.getMonth() + 1)} ${date.getDate()}, ${date.getFullYear()}`;
    return displayDateObject(date, DateTime.DATE_FULL);
  } else throw new Error('[helper: displayDate] date !instanceof (String || Date)');
};

export const convertDateObjToHTMLInputVal = (date) => {
  if (date instanceof Date) {
    const yyyy = date.getFullYear();
    const mm = formatNumbToStr(date.getMonth() + 1, 2);
    const dd = formatNumbToStr(date.getDate(), 2);
    return `${yyyy}-${mm}-${dd}`;
  } else throw new Error('[helper: convertDateObjToHTMLInputVal] Input is not an instance of Date.');
};

// DONE
export const rangeOfWeek = (today = t.curDay(), toDate = t.curDate()) => {
  // Calculate range (array) of days in current week
  const result = [];
  // toDate = testDateNum > -1 ? testDateNum : t.curDate(),
  const thisMonth = t.curMonth();
  const thisYear = t.curYear();
  const numberOfDaysInLastMonth =
    thisMonth === 1 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear);
  const numberOfDaysInThisMonth = daysInMonth(thisMonth, thisYear);
  const numberOfDaysInNextMonth =
    thisMonth === 12 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear);
  const firstDayInWeek = today - toDate + (today - toDate < 1 ? numberOfDaysInLastMonth : 0);
  const lastDayInWeek =
    today + 7 - toDate - 1 - (today + 7 - toDate - 1 > numberOfDaysInThisMonth ? numberOfDaysInThisMonth : 0);
  // lastDayInWeek = firstDayInWeek + 6 - ((firstDayInWeek + 6 > numberOfDaysInThisMonth) ? numberOfDaysInThisMonth : 0);

  if (firstDayInWeek > lastDayInWeek) {
    // today > 15 && firstDayInWeek > lastDayInWeek let us know this week is the transforming week
    const condition = today > 15 ? numberOfDaysInThisMonth : numberOfDaysInLastMonth;
    const lastDaysOfEndingMonth = [];
    const firstDaysOfIncomingMonth = [];
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
  const curDay = t.curDay();
  const curMonth = t.curMonth();
  const curYear = t.curYear();
  const birthsInLastMonth = getBirthsInMonth(contacts, curMonth - 1 === 0 ? 12 : curMonth - 1);
  const birthsInCurrentMonth = getBirthsInMonth(contacts, curMonth);
  const birthsInNextMonth = getBirthsInMonth(contacts, curMonth + 1 === 13 ? 1 : curMonth + 1);

  if (Array.isArray(dayInWeekArr[0])) {
    // if we have array, it means that we have a transforming-week: a week have days in current month & previous/next month
    let arr1, arr2;

    if (curDay > 15) {
      // we're in last days of the current month

      arr1 = sortByDay(
        birthsInCurrentMonth.filter((contact) => {
          const birth = contact.birth ? contact.birth.getDate() : 0;
          return dayInWeekArr[0].indexOf(birth) !== -1;
        })
      );

      arr2 = sortByDay(
        birthsInNextMonth.filter((contact) => {
          const birth = contact.birth ? contact.birth.getDate() : 0;
          return dayInWeekArr[1].indexOf(birth) !== -1;
        })
      );
    } else {
      // we're in first days of the current month

      arr1 = sortByDay(
        birthsInLastMonth.filter((contact) => {
          const birth = contact.birth ? contact.birth.getDate() : 0;
          return dayInWeekArr[0].indexOf(birth) !== -1;
        })
      );

      arr2 = sortByDay(
        birthsInCurrentMonth.filter((contact) => {
          const birth = contact.birth ? contact.birth.getDate() : 0;
          return dayInWeekArr[1].indexOf(birth) !== -1;
        })
      );
    }

    return arr1.concat(arr2);
  } else {
    // we're in the middle of the current month
    return sortByDay(
      birthsInCurrentMonth.filter((contact) => {
        const birth = contact.birth ? contact.birth.getDate() : 0;
        return dayInWeekArr.indexOf(birth) !== -1;
      })
    );
  }
};

// DONE
export const getBirthsInMonth = (contacts, month = t.curMonth()) => {
  const birthsInMonth = contacts.filter((contact) => {
    return contact.birth && contact.birth.getMonth() + 1 === month;
  });
  return sortByDay(birthsInMonth);
};

export const getListOfBirthsToday = (contacts) => {
  const today = t.curDay();
  const birthsInMonth = getBirthsInMonth(contacts);
  const birthsToday = birthsInMonth.filter((contact) => contact.birth && contact.birth.getDate() === today);
  return birthsToday;
};

export const filterBirthsToday = (contacts) => {
  // re-update happy-birthday list
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
  return contacts.map((contact) => {
    contact.hpbd = birthsToday.includes((contactHasBirthToday) => {
      return contactHasBirthToday.name === contact.name;
    });
    return contact;
  });
};
