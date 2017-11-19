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

export const convertBirthday = birthStr => {
    const birthArr = birthStr.split('-'),
        year = birthArr[0],
        month = convertMonthToText(birthArr[1]),
        day = birthArr[2];
    return `${month} ${day}, ${year}`;
};

export const timeCalculator = () => {
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
};
