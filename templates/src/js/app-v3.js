const CONTACTS = (function() {
    let birthdayList,
        IDList,
        maxID,
        API = {},
        isModified = false,
        time = (function() {
            let newDateObj = new Date(),
                isLeap = function (year) {// tính năm nhuận
                  if (year % 4 || (year % 100 === 0 && year % 400)) {return 0;}
                  else {return 1;}
                },
                howManyDaysInMonth = function (month, year) {// tính ngày trong tháng
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
        }()),
        isStorageAvailable = (function storageAvailable(type) {
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
        }('localStorage'));

    // Douglas Crockford's method
    Function.prototype.method = function(name, func) {
        if (!this.prototype.hasOwnProperty(name)) {
            this.prototype[name] = func;
        }
        return this;
    };

    const createDOMIn = function(thisDOM, propertyOfThisDOM, valueOfProperty, parentDOMOfThisDOM) {
        const newDOM = document.createElement(thisDOM);
        if (propertyOfThisDOM && valueOfProperty) {newDOM[propertyOfThisDOM] = valueOfProperty;}
        if (parentDOMOfThisDOM) {parentDOMOfThisDOM.appendChild(newDOM);}
        return newDOM;
    };

    // ContactList & Person constructor
    const ContactList = (function () {
        return function () {
            this.contacts = [];
            this.isModified = false;
        };
    }()),
    Person = (function () {
        return function (newPerson) {
            this.name = newPerson.name;
            this.id = newPerson.id;
            if (newPerson.labels) { this.labels = newPerson.labels; }
            if (newPerson.birth) { this.birth = newPerson.birth; }
            if (newPerson.note) { this.note = newPerson.note; }
            if (newPerson.nickname) { this.nickname = newPerson.nickname; }
            if (newPerson.company) { this.company = newPerson.company; }
            if (newPerson.jobTitle) { this.jobTitle = newPerson.jobTitle; }
            if (newPerson.email) { this.email = newPerson.email; }
            if (newPerson.address) { this.address = newPerson.address; }
            if (newPerson.website) { this.website = newPerson.website; }
            if (newPerson.relationship) { this.relationship = newPerson.relationship; }
            if (newPerson.phone) { this.phone = newPerson.phone; }
        };
    }());

    ContactList.method('add', function (newPerson) {
        this.contacts.push(newPerson);
        this.isModified = true;
    }).method('retrieve', function () {
        // not allow returning a ref to the real data, prevent modifying data
        // deep-clone array techique on StackOverflow:
        // https://stackoverflow.com/a/23536726/5805244
        // return JSON.parse(JSON.stringify(this.contacts));
        let promise = new Promise(    (resolveFunc, rejectFunc) => {
            let data = this.contacts;
            resolveFunc(data);
        });
        return promise.then(function (data) {
            return JSON.stringify(data);
        }).then((jsonStr) => {
            return JSON.parse(jsonStr);
        }).catch(() => {
            throw new Error({
                name: 'JSON Error',
                description: "There's an error while playing with JSON data."
            });
        });
    }).method('deleteAll', function () {
        this.contacts = [];
    }).method('find', function (IDList, callbackFunc, callbackObj) {
        let len = this.contacts.length;

        if (Array.isArray(IDList)) {
            IDList.forEach((IDStr) => {
                this.contacts.forEach((birthElement, index) => {
                    if (birthElement.id === IDStr) {
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
        } else if (typeof IDList === 'string') {// pass ID string when edit or just need to find index of the only person who has that ID in this.contacts
            for (let i = 0; i < len; i += 1) {
                if (this.contacts[i].id === IDList) {
                    if (callbackFunc && typeof callbackFunc === 'function') {
                        if (callbackObj && typeof callbackObj === 'object') {
                            callbackFunc.call(callbackObj, i);
                        } else {
                            callbackFunc(i);
                        }
                    }
                    return i;
                }
            }
        }

        if (isModified) {
            let updatedData = birthdayList.filter(function(element, index) {
                return element;
            });
            this.replaceData(updatedData);
        }
    }).method('renderHTML', function (htmlString) {
        document.getElementById('contacts-list').innerHTML = htmlString;
    }).method('displayAllItems', () => {
        let htmlString = '';
        this.contacts.forEach((element, index) => {
            htmlString += element.renderItem();
        }, this);
        return htmlString;
    });

    Person.method('editInfo', function (newInfoObj) {
        if (newInfoObj.name) { this.name = newInfoObj.name; }
        if (newInfoObj.birthday !== undefined) { this.birth = newInfoObj.birthday; }
        if (newInfoObj.note !== undefined) { this.note = note; }
        if (newInfoObj.labels !== undefined) { this.labels = newInfoObj.labels; }
        if (newInfoObj.birth !== undefined) { this.birth = newInfoObj.birth; }
        if (newInfoObj.note !== undefined) { this.note = newInfoObj.note; }
        if (newInfoObj.nickname !== undefined) { this.nickname = newInfoObj.nickname; }
        if (newInfoObj.company !== undefined) { this.company = newInfoObj.company; }
        if (newInfoObj.jobTitle !== undefined) { this.jobTitle = newInfoObj.jobTitle; }
        if (newInfoObj.email !== undefined) { this.email = newInfoObj.email; }
        if (newInfoObj.address !== undefined) { this.address = newInfoObj.address; }
        if (newInfoObj.website !== undefined) { this.website = newInfoObj.website; }
        if (newInfoObj.relationship !== undefined) { this.relationship = newInfoObj.relationship; }
        if (newInfoObj.phone !== undefined) { this.phone = newInfoObj.phone; }
    }).method('renderItem', function() {// create item in list
        return `<li><input type="checkbox" id="${this.id}"><label></label><span style="display: none;">${this.id}</span><h3>${this.name}</h3><p>${this.note}</p><div class="birthBlock">Day<br><span>${this.birth[0]}</span></div><div class="birthBlock">Month<br><span>${this.birth[1]}</span></div><div class="birthBlock">Year<br><span>${this.birth[2]}</span></div></li>`;
    }).method('renderBox', function () {

    });

    //////////////////////////////////////////////////////////////////
    //////////////////////// TESTING AREA ////////////////////////////
    //////////////////////////////////////////////////////////////////
    Person.method('getName', function () {
        return this.name;
    }).method('getBirth', function () {
        return this.birth;
    });
    let nam = new Person({
        name: 'lvnam',
        birth: [2,5,124],
        note: 'asnfasi'
    });
    console.log(nam.getName());
    console.log(nam.getBirth());
    nam.editInfo({birthday: [4,1]});
    console.log(nam.getName());
    console.log(nam.getBirth());
    //////////////////////////////////////////////////////////////////
    //////////////////////// TESTING AREA ////////////////////////////
    //////////////////////////////////////////////////////////////////

    API.shouldBeSaved = function() {
        return isModified;
    };
    API.dontSaveDataToLocalStorageAgain = function() {
        isModified = false;
    };
    API.listLength = function() {
        return birthdayList.length;
    };
    API.getRandomCode = function(string_length) {
    // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
        let text = "";
        const POSSIBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            POSSIBLE_SCOPE = POSSIBLE.length;
      
        for (let i = 0; i < string_length; i += 1) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
        }

        return text;
    };
    API.editData = function(newNameStr, newBirthdayArr, newNoteStr, idx) {
    // this func editData is only currying func (partial application) in this app.
        if (typeof idx === 'undefined') {
            return function(idx) {
                birthdayList[idx].name = newNameStr;
                birthdayList[idx].birthDay = newBirthdayArr;
                birthdayList[idx].note = newNoteStr;
                isModified = true;
            };
        }
        birthdayList[idx].name = newNameStr;
        birthdayList[idx].birthDay = newBirthdayArr;
        birthdayList[idx].note = newNoteStr;
        isModified = true;
    };
    API.rmData = function(idx) {
    // birthdayList.splice(idx, 1);
        delete birthdayList[idx];
        isModified = true;
    };
    API.rmAllData = function() {
        birthdayList = [];
        isModified = true;
    };
    API.saveDataToLocalStorage = function() {
        localStorage.birthdayList = JSON.stringify(birthdayList);
    };
    API.replaceData = function(newData) {
        birthdayList = newData;
    };
    API.rangeOfWeek = function(testDay, testDateNum) {//Calculate range (array) of days in current week
        let result = [],
            today = testDay || time.curDay,//ngày trong tháng, 1-based
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
    };
    API.filterBirthInMonth = function(sourceArr, month) {
        return sourceArr.filter(function(element, index) {
            return element.birthDay[1] === month;
        }).sort(function(a, b) {
            return a.birthDay[0] - b.birthDay[0];
        });
    };
    API.filterBirthInWeek = function(dayInWeekArr) {
        let lastDayOfMonth,
            curDay = time.curDay,
            curMonth = time.curMonth,
            curYear = time.curYear,
            filterBirthInLastMonth = this.filterBirthInMonth(birthdayList, (curMonth - 1 === 0) ? 12 : (curMonth - 1)),
            filterBirthInCurrentMonth = this.filterBirthInMonth(birthdayList, curMonth),
            filterBirthInNextMonth = this.filterBirthInMonth(birthdayList, (curMonth + 1 === 13) ? 1 : (curMonth + 1));

        if (Array.isArray(dayInWeekArr[0])) {//if we have ARRAY, it means we have a transform-week: a week have days in this month and another month
            let arr1, arr2;

            if (curDay > 15) {// we're in last days of the current month
                arr1 = filterBirthInCurrentMonth.filter(function(element, index) {
                    return dayInWeekArr[0].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
                arr2 = filterBirthInNextMonth.filter(function(element, index) {
                    return dayInWeekArr[1].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
            } else {// we're in first days of the current month
                arr1 = filterBirthInLastMonth.filter(function(element, index) {
                    return dayInWeekArr[0].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
                arr2 = filterBirthInCurrentMonth.filter(function(element, index) {
                    return dayInWeekArr[1].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
            }
      
            return arr1.concat(arr2);    
        } else {// we're in the middle of the current month
            return filterBirthInCurrentMonth.filter(function(element, index) {
                return dayInWeekArr.indexOf(element.birthDay[0]) !== -1;
            }).sort(function(a, b) {
                return a.birthDay[0] - b.birthDay[0];
            });
        }
    };

    return {
        isStorageAvailable:         isStorageAvailable,
        getTime:                    time,
        getBirthList:               API.getBirthList,
        listLength:                 API.listLength,
        getRandomID:                API.getRandomCode,
        addData:                    API.addData,
        find:                       API.find,
        editData:                   API.editData,
        rmData:                     API.rmData,
        rmAllData:                  API.rmAllData,
        shouldBeSaved:              API.shouldBeSaved,
        dontSaveDataAgain:          API.dontSaveDataAgain,
        saveDataToLocalStorage:     API.saveDataToLocalStorage,
        replaceData:                API.replaceData,
        rangeOfWeek:                API.rangeOfWeek,
        filterBirthInMonth:         API.filterBirthInMonth,
        filterBirthInWeek:          API.filterBirthInWeek
    };
}());